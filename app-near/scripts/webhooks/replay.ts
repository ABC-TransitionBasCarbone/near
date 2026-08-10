import { AnswerErrorStatus, AnswerType, type Prisma } from "@prisma/client";
import { parseArgs } from "scripts/utils";
import { recordAnswerErrorAttempt } from "~/server/anwser-error/recordAttempt";
import { handleCarbonFootprintAnswer } from "~/server/carbon-footprint/handleCarbonFootprintAnswer";
import { db } from "~/server/db";
import { getOneSurveyByName } from "~/server/surveys/get";
import { handleTypeformAnswer } from "~/server/typeform/handleTypeformAnswer";
import { SignatureType, signPayload } from "~/server/typeform/signature";
import { buildRequest } from "~/server/utils/buildRequest";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages:
  - npm run webhooks:replay -- id=<id>
  - npm run webhooks:replay -- all=true [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]
  - npm run webhooks:replay -- surveyName=<surveyName> [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]
`);
};

type RawAnswerError = Prisma.RawAnswerErrorGetPayload<object>;

const getRowSurveyName = (row: RawAnswerError): string | undefined => {
  const payload = row.rawPayload as {
    neighborhoodId?: string;
    form_response?: { hidden?: { neighborhood?: string } };
  } | null;

  return row.answerType === AnswerType.CARBON_FOOTPRINT
    ? payload?.neighborhoodId
    : payload?.form_response?.hidden?.neighborhood;
};

export type ReplayResult = {
  success: boolean;
  status: number;
  text: string;
};

export const replayPayload = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  answerType: AnswerType,
): Promise<ReplayResult> => {
  const body = JSON.stringify(payload);
  const signatureType =
    answerType === AnswerType.CARBON_FOOTPRINT
      ? SignatureType.NGC_FORM
      : SignatureType.TYPEFORM;
  const signature = signPayload(body, signatureType);

  const request = buildRequest(payload, signature);

  const response =
    answerType === AnswerType.CARBON_FOOTPRINT
      ? // @ts-expect-error buildRequest is a partial NextRequest, enough for the handler
        await handleCarbonFootprintAnswer(request)
      : // @ts-expect-error buildRequest is a partial NextRequest, enough for the handler
        await handleTypeformAnswer(request);

  return {
    success: response.status === 200 || response.status === 201,
    status: response.status,
    text: await response.text(),
  };
};

const replayOne = async (row: RawAnswerError): Promise<boolean> => {
  const result = await replayPayload(row.rawPayload, row.answerType);

  if (result.success) {
    await recordAnswerErrorAttempt(row.id, { success: true });
    console.log(`[replay] id=${row.id} resolved (status ${result.status})`);
    return true;
  }

  await recordAnswerErrorAttempt(row.id, {
    success: false,
    errorMessage: result.text,
  });
  console.log(
    `[replay] id=${row.id} still failing (status ${result.status}): ${result.text}`,
  );
  return false;
};

type ReplayArgs = {
  id?: string;
  all?: string;
  type?: AnswerType;
  surveyName?: string;
};

export const selectRowsToReplay = async (
  args: ReplayArgs,
): Promise<RawAnswerError[]> => {
  const { id, all, type, surveyName } = args;

  if (!id && all !== "true" && !surveyName) {
    throw new Error(
      "Verify usage command: id, all=true or surveyName is missing",
    );
  }

  if (surveyName && !(await getOneSurveyByName(surveyName))) {
    const validSurveyNames = (
      await db.survey.findMany({
        select: { name: true },
        orderBy: { name: "asc" },
      })
    ).map(({ name }) => name);

    throw new Error(
      `Survey "${surveyName}" not found. Valid survey names: ${validSurveyNames.join(", ")}`,
    );
  }

  return (
    await db.rawAnswerError.findMany({
      where: {
        status: AnswerErrorStatus.ACTIVE,
        ...(id ? { id: Number(id) } : {}),
        ...(type ? { answerType: type } : {}),
      },
      orderBy: { id: "asc" },
    })
  ).filter((row) => !surveyName || getRowSurveyName(row) === surveyName);
};

export const replay = async (args: ReplayArgs = parseArgs() as ReplayArgs) => {
  const rows = await selectRowsToReplay(args);

  if (rows.length === 0) {
    console.log("Nothing to replay (not found, or already resolved)");
    return;
  }

  let resolved = 0;
  for (const row of rows) {
    if (await replayOne(row)) resolved++;
  }

  console.log(`Replayed ${rows.length} payload(s), ${resolved} resolved`);
};

try {
  await replay();

  console.log("End replay successfully");
} catch (e) {
  if (e instanceof Error) {
    endProcess(e.message);
  } else {
    endProcess("unknown error");
  }
}

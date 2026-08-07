import { AnswerErrorStatus, AnswerType, type Prisma } from "@prisma/client";
import { parseArgs } from "scripts/utils";
import { recordAnswerErrorAttempt } from "~/server/anwser-error/recordAttempt";
import { handleCarbonFootprintAnswer } from "~/server/carbon-footprint/handleCarbonFootprintAnswer";
import { db } from "~/server/db";
import { handleTypeformAnswer } from "~/server/typeform/handleTypeformAnswer";
import { SignatureType, signPayload } from "~/server/typeform/signature";
import { buildRequest } from "~/server/utils/buildRequest";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages:
  - npm run webhooks:replay -- id=<id>
  - npm run webhooks:replay -- all=true [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]
`);
};

type RawAnswerError = Prisma.RawAnswerErrorGetPayload<object>;

const replayOne = async (row: RawAnswerError): Promise<boolean> => {
  const body = JSON.stringify(row.rawPayload);
  const signatureType =
    row.answerType === AnswerType.CARBON_FOOTPRINT
      ? SignatureType.NGC_FORM
      : SignatureType.TYPEFORM;
  const signature = signPayload(body, signatureType);

  const request = buildRequest(row.rawPayload, signature);

  const response =
    row.answerType === AnswerType.CARBON_FOOTPRINT
      ? // @ts-expect-error buildRequest is a partial NextRequest, enough for the handler
        await handleCarbonFootprintAnswer(request)
      : // @ts-expect-error buildRequest is a partial NextRequest, enough for the handler
        await handleTypeformAnswer(request);

  if (response.status === 200 || response.status === 201) {
    await recordAnswerErrorAttempt(row.id, { success: true });
    console.log(`[replay] id=${row.id} resolved (status ${response.status})`);
    return true;
  }

  const errorMessage = await response.text();
  await recordAnswerErrorAttempt(row.id, { success: false, errorMessage });
  console.log(
    `[replay] id=${row.id} still failing (status ${response.status}): ${errorMessage}`,
  );
  return false;
};

const replay = async () => {
  const { id, all, type } = parseArgs() as {
    id?: string;
    all?: string;
    type?: AnswerType;
  };

  if (!id && all !== "true") {
    throw new Error("Verify usage command: id or all=true is missing");
  }

  const rows = await db.rawAnswerError.findMany({
    where: {
      status: AnswerErrorStatus.ACTIVE,
      ...(id ? { id: Number(id) } : {}),
      ...(type ? { answerType: type } : {}),
    },
    orderBy: { id: "asc" },
  });

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

import { AgeCategory, type SuAnswer, SurveyPhase } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import { type ConvertedSuAnswer } from "~/types/SuAnswer";
import {
  type TypeformWebhookPayload,
  TypeformWebhookSchema,
} from "~/types/typeform";
import { createSu } from "../su/create";
import { getOneSurveyByName } from "../surveys/get";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import { typeformSchemaMapper } from "./schema";
import { verifySignature } from "./signature";

export const handleAnswer = async (req: NextRequest): Promise<NextResponse> => {
  let formId: string | undefined = undefined;
  try {
    // parse body
    const body = await req.text();
    const parsedBody: TypeformWebhookPayload = TypeformWebhookSchema.parse(
      JSON.parse(body),
    );
    formId = parsedBody.form_response.form_id;
    console.info("[whebhook typeform]", formId, body);

    // check typeform signature header
    if (!isValidSignature(req, body)) {
      return unauthorizedResponse(formId);
    }

    // get reference mapping
    const referencesMapping = getReferencesMapping(formId);
    if (!referencesMapping) {
      return referenceMappingNotFoundResponse(formId);
    }

    // convert
    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.info("[whebhook typeform]", formId, JSON.stringify(answers));

    // switch case mapping depending on forms
    if (formId === env.SU_FORM_ID) {
      return await handleSuForm(parsedBody, answers, formId);
    }
    return unknwonFormIdResponse(formId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[whebhook typeform]", formId, "ZOD ERROR :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      console.error("[whebhook typeform]", formId, "ERROR :", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[whebhook typeform]", formId, "UNKNOWN ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

const handleSuForm = async (
  parsedBody: TypeformWebhookPayload,
  answers: Record<string, string | boolean>,
  formId: string,
): Promise<
  NextResponse<{ message: string }> | NextResponse<{ error: string }>
> => {
  // should be part of neighborhood
  if (answers.isNeighborhoodResident !== true) {
    return NextResponse.json(
      { message: "user should live in neighborhood" },
      { status: 200 },
    );
  }

  // should be under 15
  if (
    !Object.values(AgeCategory).includes(answers.ageCategory as AgeCategory)
  ) {
    return NextResponse.json(
      { message: "user age is not allowed" },
      { status: 200 },
    );
  }

  // could throw zod exception from zod parsing
  const parsedAnswer = typeformSchemaMapper[formId]?.parse(
    answers,
  ) as ConvertedSuAnswer;

  // remove isNeighborhoodResident property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isNeighborhoodResident, ...createQuery } = parsedAnswer;

  // no survey name in hidden fields
  const surveyName = parsedBody.form_response.hidden?.neighborhood;
  if (!surveyName) {
    return noSurveyNameProvided(formId);
  }

  // continue only if we are in phase 2
  const survey = await getOneSurveyByName(surveyName);
  if (!survey) {
    return noSurveyFoundResponse(surveyName);
  }

  if (survey.phase !== SurveyPhase.STEP_2_SU_SURVERY) {
    return notInPhaseSuSurveyResponse(surveyName);
  }

  // create su
  const broadcastChannel = parsedBody.form_response.hidden?.broadcast_channel;

  await createSu({ ...createQuery, broadcastChannel } as SuAnswer, surveyName);

  return NextResponse.json({ message: "created" }, { status: 201 });
};

const isValidSignature = (req: NextRequest, body: string): boolean => {
  const signature = req.headers.get("Typeform-Signature");
  return verifySignature(signature, body);
};

const unknwonFormIdResponse = (formId?: string): NextResponse =>
  NextResponse.json(
    { error: "Unknown formid", details: formId },
    { status: 404 },
  );

const unauthorizedResponse = (formId?: string): NextResponse =>
  NextResponse.json(
    { error: "Not authorized", details: formId },
    { status: 401 },
  );

const noSurveyFoundResponse = (
  surveyName?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", surveyName, "Survey not found");
  return NextResponse.json(
    { error: `Survey name ${surveyName} not found` },
    { status: 404 },
  );
};

const noSurveyNameProvided = (
  formId?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", formId, "Survey name not found");
  return NextResponse.json({ error: "Survey name not found" }, { status: 400 });
};

const referenceMappingNotFoundResponse = (formId?: string): NextResponse => {
  console.error(
    "[whebhook typeform]",
    formId,
    "ERROR: References mapping not found",
  );
  return NextResponse.json(
    { error: "References mapping not found" },
    { status: 400 },
  );
};
function notInPhaseSuSurveyResponse(
  surveyName: string,
):
  | NextResponse<{ message: string }>
  | NextResponse<{ error: string }>
  | PromiseLike<
      NextResponse<{ message: string }> | NextResponse<{ error: string }>
    > {
  console.error(
    "[whebhook typeform]",
    surveyName,
    `step ${SurveyPhase.STEP_2_SU_SURVERY} is over for ${surveyName}`,
  );
  return NextResponse.json(
    {
      error: `step ${SurveyPhase.STEP_2_SU_SURVERY} is over for ${surveyName}`,
    },
    { status: 200 },
  );
}

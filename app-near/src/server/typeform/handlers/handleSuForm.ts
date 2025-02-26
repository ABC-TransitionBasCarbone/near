import {
  AgeCategory,
  type Survey,
  SurveyPhase,
  type SuAnswer,
} from "@prisma/client";
import { NextResponse } from "next/server";
import type { ConvertedSuAnswer } from "../../../types/SuAnswer";
import type { TypeformWebhookPayload } from "../../../types/typeform";
import { createSu } from "../../su/answers/create";
import { getOneSurveyByName } from "../../surveys/get";
import { typeformSchemaMapper } from "../schema";

export const handleSuForm = async (
  parsedBody: TypeformWebhookPayload,
  answers: Record<string, string | boolean>,
  formId: string,
): Promise<
  NextResponse<{ message: string }> | NextResponse<{ error: string }>
> => {
  if (isNotPartOfNeighborhood(answers)) {
    return okResponse("user should live in neighborhood");
  }

  if (isUnder15(answers)) {
    return okResponse("user should be under 15");
  }

  // could throw zod exception from zod parsing
  const parsedAnswer = typeformSchemaMapper[formId]?.parse(
    answers,
  ) as ConvertedSuAnswer;

  // remove isNeighborhoodResident property before save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isNeighborhoodResident, ...createQuery } = parsedAnswer;

  // no survey name in hidden fields
  const surveyName = parsedBody.form_response.hidden?.neighborhood;
  if (!surveyName) {
    return noSurveyNameProvidedResponse(formId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const survey = await getOneSurveyByName(surveyName);
  if (!survey) {
    return noSurveyFoundResponse(surveyName);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  if (isNotInPhaseTwo(survey)) {
    return notInPhaseSuSurveyResponse(surveyName);
  }

  // create su
  const broadcastChannel = parsedBody.form_response.hidden?.broadcast_channel;
  await createSu({ ...createQuery, broadcastChannel } as SuAnswer, surveyName);

  return NextResponse.json({ message: "created" }, { status: 201 });
};

export const noSurveyFoundResponse = (
  surveyName?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", surveyName, "Survey not found");
  return NextResponse.json(
    { error: `Survey name ${surveyName} not found` },
    { status: 404 },
  );
};

const okResponse = (message: string): NextResponse<{ message: string }> =>
  NextResponse.json({ message }, { status: 200 });

const noSurveyNameProvidedResponse = (
  formId?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", formId, "Survey name not found");
  return NextResponse.json({ error: "Survey name not found" }, { status: 400 });
};

const notInPhaseSuSurveyResponse = (
  surveyName: string,
): NextResponse<{ error: string }> => {
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
};

const isUnder15 = (answers: Record<string, string | boolean>) => {
  return !Object.values(AgeCategory).includes(
    answers.ageCategory as AgeCategory,
  );
};

const isNotPartOfNeighborhood = (answers: Record<string, string | boolean>) => {
  return answers.isNeighborhoodResident !== true;
};

const isNotInPhaseTwo = (survey: Survey) => {
  return survey.phase !== SurveyPhase.STEP_2_SU_SURVERY;
};

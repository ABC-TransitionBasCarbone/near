import { type SurveyPhase, type Survey } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { getOneSurveyByName } from "~/server/surveys/get";
import { ErrorCode } from "~/types/enums/error";

const noSurveyNameProvidedResponse = (
  formId?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", formId, "Survey name not provided");
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: ErrorCode.WRONG_SURVEY_NAME,
  });
};

const noSurveyFoundResponse = (
  surveyName?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook typeform]", surveyName, "Survey not found");
  throw new TRPCError({
    code: "NOT_FOUND",
    message: ErrorCode.WRONG_SURVEY_NAME,
  });
};

export const getSurveyInformations = async (
  neighborhood: string | undefined,
  formId: string,
): Promise<{ surveyName: string; survey: Survey }> => {
  const surveyName = neighborhood;
  if (!surveyName) {
    noSurveyNameProvidedResponse(formId);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const survey = await getOneSurveyByName(surveyName!);
  if (!survey) {
    noSurveyFoundResponse(surveyName);
  }

  return { surveyName: surveyName!, survey: survey! };
};

export const notInPhaseSuSurveyResponse = (
  surveyName: string,
  validPhase: SurveyPhase,
): NextResponse<{ error: string }> => {
  console.error(
    "[whebhook typeform]",
    surveyName,
    `step ${validPhase} is over for ${surveyName}`,
  );
  return NextResponse.json(
    {
      error: `step ${validPhase} is over for ${surveyName}`,
    },

    { status: 200 },
  );
};

export const isNotInPhase = (survey: Survey, validPhase: SurveyPhase) => {
  return survey.phase !== validPhase;
};

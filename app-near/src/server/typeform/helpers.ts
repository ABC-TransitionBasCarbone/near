import { type Survey, AgeCategory, SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { getOneSurveyByName } from "~/server/surveys/get";
import { type CarbonFootprintType } from "~/types/CarbonFootprint";
import { ErrorCode } from "~/types/enums/error";
import { TypeformType, type ConvertedAnswer } from "~/types/Typeform";

export const getFormIdType = (formId?: string): TypeformType => {
  if (!formId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: ErrorCode.MISSING_FORM_ID,
    });
  }

  const mapper: Record<string, TypeformType> = {
    [env.SU_FORM_ID]: TypeformType.SU,
    [env.WAY_OF_LIFE_FORM_ID]: TypeformType.WAY_OF_LIFE,
  };

  const result = mapper[formId];

  if (!result) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: ErrorCode.WRONG_FORM_ID,
    });
  }

  return result;
};

const noSurveyNameProvidedResponse = (
  surveyType: TypeformType | CarbonFootprintType,
): NextResponse<{ error: string }> => {
  console.error("[whebhook]", surveyType, "Survey name not provided");
  throw new TRPCError({
    code: "BAD_REQUEST",
    message: ErrorCode.MISSING_SURVEY_NAME,
  });
};

const noSurveyFoundResponse = (
  surveyName?: string,
): NextResponse<{ error: string }> => {
  console.error("[whebhook]", surveyName, "Survey not found");
  throw new TRPCError({
    code: "NOT_FOUND",
    message: ErrorCode.WRONG_SURVEY_NAME,
  });
};

export const getSurveyInformations = async (
  neighborhood: string | undefined,
  surveyType: TypeformType | CarbonFootprintType,
): Promise<{ surveyName: string; survey: Survey }> => {
  if (!neighborhood) {
    noSurveyNameProvidedResponse(surveyType);
  }

  const survey = await getOneSurveyByName(neighborhood!);
  if (!survey) {
    noSurveyFoundResponse(neighborhood);
  }

  return { surveyName: neighborhood!, survey: survey! };
};

export const notInPhaseSuSurveyResponse = (
  surveyName: string,
  validPhase: SurveyPhase,
): NextResponse<{ error: string }> => {
  console.error(
    "[whebhook]",
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

export const okResponse = (
  message: string,
): NextResponse<{ message: string }> =>
  NextResponse.json({ message }, { status: 200 });

export const isUnder15 = (answers: ConvertedAnswer) => {
  return !Object.values(AgeCategory).includes(
    answers.ageCategory as AgeCategory,
  );
};

export const isNotPartOfNeighborhood = (answers: ConvertedAnswer) => {
  return answers.isNeighborhoodResident !== true;
};

export const getValidSurveyPhase = (
  typeformType: TypeformType,
): SurveyPhase => {
  return typeformType === TypeformType.SU
    ? SurveyPhase.STEP_2_SU_SURVERY
    : SurveyPhase.STEP_4_ADDITIONAL_SURVEY;
};

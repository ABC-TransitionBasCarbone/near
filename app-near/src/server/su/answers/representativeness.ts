/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { CategoryStat, type CategoryStats } from "~/types/SuAnswer";
import { countAnswersByCategories, countAnswsers } from "./count";
import { getInseeTargetsByCategories } from "~/server/neighborhoods/targets";
import { getOneSurvey } from "~/server/surveys/get";
import { TRPCError } from "@trpc/server";

const representativeness = async (
  surveyId: number,
): Promise<CategoryStats | null> => {
  const survey = await getOneSurvey(surveyId);
  if (!survey) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `survey ${surveyId} not found`,
    });
  }

  const suAnswersTotal = await countAnswsers(surveyId);

  if (!suAnswersTotal) {
    return null;
  }

  const suAnswersByAge = await countAnswersByCategories(
    surveyId,
    "ageCategory",
  );

  const suAnswersByGender = await countAnswersByCategories(surveyId, "gender");

  const suAnswerByCS = await countAnswersByCategories(
    surveyId,
    "professionalCategory",
  );

  const inseeStats = await getInseeTargetsByCategories(surveyId);

  const result = Object.values(CategoryStat).reduce(
    (acc, value) => {
      acc[value as CategoryStat] =
        100 *
        (inseeStats[value] -
          (suAnswersByAge[value] ||
            suAnswersByGender[value] ||
            suAnswerByCS[value] ||
            0) /
            Math.max(Number(survey.sampleTarget), suAnswersTotal));
      return acc;
    },
    {} as Record<CategoryStat, number>,
  );
  return result;
};

const representativenessService = { representativeness };

export default representativenessService;

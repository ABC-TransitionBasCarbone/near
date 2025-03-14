/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { CategoryStat, type CategoryStats } from "~/types/SuAnswer";
import { countAnswersByCategories, countAnswers } from "./count";
import targetService from "~/server/neighborhoods/targets";
import { getOneSurvey } from "~/server/surveys/get";
import { TRPCError } from "@trpc/server";

const countInObject = (object: Record<string, number>) =>
  Object.values(object).reduce((acc, value) => acc + value, 0);

const buildCategoryStats = (
  categories: CategoryStat[],
  answers: Record<string, number>,
  total: number,
) =>
  categories.reduce(
    (acc, cat) => {
      acc[cat] = {
        value: answers[cat] || 0,
        total,
      };
      return acc;
    },
    {} as Record<CategoryStat, { value: number; total: number }>,
  );

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

  const suAnswersTotal = await countAnswers(surveyId);

  if (!suAnswersTotal) {
    return null;
  }

  const suAnswersByAge = await countAnswersByCategories(
    surveyId,
    "ageCategory",
  );
  const suAnswersByAgeCount = countInObject(suAnswersByAge);

  const suAnswersByGender = await countAnswersByCategories(surveyId, "gender");
  const suAnswersByGenderCount = countInObject(suAnswersByGender);

  const suAnswerByCS = await countAnswersByCategories(
    surveyId,
    "professionalCategory",
  );
  const suAnswerByCSCount = countInObject(suAnswerByCS);

  const inseeStats = await targetService.getInseeTargetsByCategories(surveyId);

  const allCategoriesStat: Record<
    CategoryStat,
    { value: number; total: number }
  > = {
    ...buildCategoryStats(
      [
        CategoryStat.from_15_to_29,
        CategoryStat.from_30_to_44,
        CategoryStat.from_45_to_59,
        CategoryStat.from_60_to_74,
        CategoryStat.above_75,
      ],
      suAnswersByAge,
      suAnswersByAgeCount,
    ),
    ...buildCategoryStats(
      [
        CategoryStat.cs1,
        CategoryStat.cs2,
        CategoryStat.cs3,
        CategoryStat.cs4,
        CategoryStat.cs5,
        CategoryStat.cs6,
        CategoryStat.cs7,
        CategoryStat.cs8,
      ],
      suAnswerByCS,
      suAnswerByCSCount,
    ),
    ...buildCategoryStats(
      [CategoryStat.man, CategoryStat.woman],
      suAnswersByGender,
      suAnswersByGenderCount,
    ),
  };

  const result = Object.entries(allCategoriesStat).reduce(
    (acc, [cat, stat]) => {
      acc[cat as CategoryStat] =
        100 *
        (inseeStats[cat as CategoryStat] -
          stat.value / Math.max(Number(survey.sampleTarget), stat.total));
      return acc;
    },
    {} as Record<CategoryStat, number>,
  );

  return result;
};

const representativenessService = { representativeness };

export default representativenessService;

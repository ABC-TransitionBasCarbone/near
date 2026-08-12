import { db } from "../../db";
import { type CategoryStat, enumValueToCategoryStat } from "~/types/SuAnswer";

export const countAnswers = async (surveyId: number): Promise<number> => {
  return db.suAnswer.count({ where: { surveyId } });
};

export const countAnswersByCategories = async (
  surveyId: number,
  category: "ageCategory" | "gender" | "professionalCategory",
) => {
  const result = await db.suAnswer.groupBy({
    by: [category],
    where: { surveyId },
    _count: true,
  });

  return result.reduce(
    (acc, item) => {
      const key = enumValueToCategoryStat[item[category]];
      if (!key) {
        return acc;
      }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      acc[key] = (acc[key] || 0) + item._count;
      return acc;
    },
    {} as Partial<Record<CategoryStat, number>>,
  );
};

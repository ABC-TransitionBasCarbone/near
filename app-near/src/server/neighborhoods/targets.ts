import { type CategoryStat, categoryStatQuartierMap } from "~/types/SuAnswer";
import { db } from "../db";

export const getInseeTargetsByCategories = async (
  surveyId: number,
): Promise<Record<CategoryStat, number>> => {
  const neighborhood = await db.quartier.findFirst({ where: { surveyId } });
  if (!neighborhood) {
    const existingSurveys = await db.survey.findMany({
      select: { name: true },
    });

    throw new Error(`
survey not found. 

Usage: npm run seed -- scope=su_answer surveyName=14e_arr surveyTarget=60 surveyCase=LESS_THAN_TARGET

Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
`);
  }
  return Object.entries(categoryStatQuartierMap).reduce(
    (acc, [categoryStat, dbcolumn]) => {
      acc[categoryStat as CategoryStat] =
        Number(neighborhood[dbcolumn]) / (neighborhood?.population_sum || 1);
      return acc;
    },
    {} as Record<CategoryStat, number>,
  );
};

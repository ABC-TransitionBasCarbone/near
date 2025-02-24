import { type CategoryStat, categoryStatQuartierMap } from "~/types/SuAnswer";
import { db } from "../db";
import { TRPCError } from "@trpc/server";

export const getInseeTargetsByCategories = async (
  surveyId: number,
): Promise<Record<CategoryStat, number>> => {
  const neighborhood = await db.quartier.findFirst({ where: { surveyId } });
  if (!neighborhood) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "neighborhood not found",
    });
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

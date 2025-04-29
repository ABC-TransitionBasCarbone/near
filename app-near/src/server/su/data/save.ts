import { db } from "~/server/db";
import { type ComputedSu } from "~/types/SuDetection";

export const saveSuData = async (
  surveyId: number,
  computedSus: ComputedSu[],
): Promise<number[]> => {
  await db.suData.deleteMany({ where: { surveyId } });

  await db.suData.createMany({
    data: computedSus.map((suData) => ({
      surveyId: surveyId,
      su: suData.su,
      popPercentage: suData.popPercentage,
      barycenter: suData.barycenter,
    })),
  });

  return computedSus.map((suData) => suData.su);
};

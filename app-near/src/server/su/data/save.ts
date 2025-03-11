import { db } from "~/server/db";
import { type ComputedSu } from "~/types/SuDetection";

export const saveSuData = async (
  surveyId: number,
  computedSus: ComputedSu[],
): Promise<number[]> => {
  const suNames: number[] = [];

  await db.suData.deleteMany({ where: { surveyId } });

  for (const suData of computedSus) {
    await db.suData.create({
      data: {
        surveyId: surveyId,
        su: suData.su,
        popPercentage: suData.popPercentage,
        barycenter: suData.barycenter,
      },
    });

    suNames.push(suData.su);
  }

  return suNames;
};

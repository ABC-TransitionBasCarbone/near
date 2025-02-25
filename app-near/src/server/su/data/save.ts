import { db } from "~/server/db";
import { type ComputedSu } from "~/types/SuDetection";

export const saveSuData = async (
  surveyId: number,
  computedSus: ComputedSu[],
): Promise<string[]> => {
  const suNames: string[] = [];

  for (const suData of computedSus) {
    const existingSuData = await db.suData.findUnique({
      where: { surveyId_su: { surveyId, su: suData.su } },
    });
    if (existingSuData) {
      await db.suData.update({
        where: { surveyId_su: { surveyId, su: suData.su } },
        data: {
          popPercentage: suData.popPercentage,
          barycenter: suData.barycenter,
        },
      });
    } else {
      await db.suData.create({
        data: {
          surveyId: surveyId,
          su: suData.su,
          popPercentage: suData.popPercentage,
          barycenter: suData.barycenter,
        },
      });
    }

    suNames.push(`${suData.su}`);
  }

  return suNames;
};

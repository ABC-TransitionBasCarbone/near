import { db } from "~/server/db";
import { type ComputedSu } from "~/types/SuDetection";

export const saveSuData = async (
  surveyId: number,
  computedSus: ComputedSu[],
): Promise<string[]> => {
  const suNames: string[] = [];

  for (const suData of computedSus) {
    await db.suData.upsert({
      where: {
        surveyId_su: { surveyId: surveyId, su: suData.su },
      },
      update: {
        popPercentage: suData.popPercentage,
        barycenter: suData.barycenter,
      },
      create: {
        surveyId: surveyId,
        su: suData.su,
        popPercentage: suData.popPercentage,
        barycenter: suData.barycenter,
      },
    });

    suNames.push(`${suData.su}`);
  }

  return suNames;
};

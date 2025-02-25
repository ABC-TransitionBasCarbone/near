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
        survey_id_su: { survey_id: surveyId, su: suData.su },
      },
      update: {
        pop_percentage: suData.popPercentage,
        barycenter: suData.barycenter,
      },
      create: {
        survey_id: surveyId,
        su: suData.su,
        pop_percentage: suData.popPercentage,
        barycenter: suData.barycenter,
      },
    });

    suNames.push(`${suData.su}`);
  }

  return suNames;
};

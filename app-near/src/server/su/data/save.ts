import { db } from "~/server/db";
import { type ComputedSu } from "~/types/SuDetection";

export const saveSuData = async (
  surveyId: number,
  computedSus: ComputedSu[],
): Promise<string[]> => {
  const suNames: string[] = [];

  for (const suData of computedSus) {
    const existingSuData = await db.suData.findUnique({
      where: { survey_id_su: { survey_id: surveyId, su: suData.su } },
    });
    if (existingSuData) {
      await db.suData.update({
        where: { survey_id: surveyId, su: suData.su },
        data: {
          pop_percentage: suData.popPercentage,
          barycenter: suData.barycenter,
        },
      });
    } else {
      await db.suData.create({
        data: {
          survey_id: surveyId,
          su: suData.su,
          pop_percentage: suData.popPercentage,
          barycenter: suData.barycenter,
        },
      });
    }

    suNames.push(`${suData.su}`);
  }

  return suNames;
};

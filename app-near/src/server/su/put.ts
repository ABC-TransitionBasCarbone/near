import { db } from "~/server/db";

export const saveSuData = async (
  surveyId: number,
  computedSus: { su: number; barycenter: number[]; popPercentage: number }[],
): Promise<string[]> => {
  const suNames: string[] = [];

  for (const suData of computedSus) {
    const suRecord = await db.suData.upsert({
      where: { survey_id: surveyId },
      update: {
        su: suData.su,
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

    suNames.push(`${suRecord.su}`);
  }

  return suNames;
};

export const updateSuAnswer = async (
  answers: { id: number; su: number; distanceToBarycenter: number }[],
) => {
  return db.$transaction(
    answers.map(({ id, su, distanceToBarycenter }) =>
      db.suAnswer.update({
        where: { id },
        data: { su, distanceToBarycentre: distanceToBarycenter },
      }),
    ),
  );
};

import { db } from "../db";

export const deleteSurvey = async (id: number) => {
  // throw error if survey is not found
  await db.survey.findFirstOrThrow({ where: { id } });

  await db.wayOfLifeAnswer.deleteMany({ where: { surveyId: id } });
  await db.carbonFootprintAnswer.deleteMany({ where: { surveyId: id } });
  await db.suData.deleteMany({ where: { surveyId: id } });
  await db.suAnswer.deleteMany({ where: { surveyId: id } });

  await db.quartier.delete({ where: { surveyId: id } });
  await db.survey.delete({ where: { id } });
};

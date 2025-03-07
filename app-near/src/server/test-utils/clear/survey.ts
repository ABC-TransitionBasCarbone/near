import { db } from "~/server/db";

export const clearAllSurveys = async () => {
  await db.carbonFootprintAnswer.deleteMany();
  await db.wayOfLifeAnswer.deleteMany();
  await db.suAnswer.deleteMany();
  await db.suData.deleteMany();

  await db.survey.deleteMany();
};

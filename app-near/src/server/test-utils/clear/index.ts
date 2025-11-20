import { db } from "~/server/db";

export const clearAlldata = async () => {
  await db.carbonFootprintAnswer.deleteMany();
  await db.wayOfLifeAnswer.deleteMany();
  await db.suAnswer.deleteMany();
  await db.suData.deleteMany();
  await db.rawAnswerError.deleteMany();
  await db.quartier.deleteMany();
  await db.survey.deleteMany();
  await db.user.deleteMany();
  await db.role.deleteMany();
};

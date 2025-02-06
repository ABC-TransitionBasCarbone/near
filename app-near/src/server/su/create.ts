import { type SuAnswer } from "@prisma/client";
import { db } from "../db";

export const createSu = async (answer: SuAnswer) => {
  // to change when several neighborhoods
  const survey = await db.survey.findFirst();
  if (!survey) {
    throw new Error("survey not found");
  }
  return db.suAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

import { type SuAnswer } from "@prisma/client";
import { db } from "../db";

export const createSu = async (answer: SuAnswer, surveyName: string) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  const userAlreadyExist = await db.suAnswer.findFirst({
    where: { email: answer.email },
  });

  if (userAlreadyExist) {
    throw new Error("user email already exist");
  }

  return db.suAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

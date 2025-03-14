import { type WayOfLifeAnswer } from "@prisma/client";
import { db } from "../db";

export const createWayOfLifeAnswer = async (
  answer: WayOfLifeAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  return db.wayOfLifeAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

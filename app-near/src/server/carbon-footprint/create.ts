import { type CarbonFootprintAnswer } from "@prisma/client";
import { db } from "../db";

export const createCarbonFooprintAnswer = async (
  answer: CarbonFootprintAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  return db.carbonFootprintAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

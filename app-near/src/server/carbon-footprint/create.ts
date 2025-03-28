import { db } from "../db";
import { type ConvertedCarbonFootprintAnswer } from "~/types/CarbonFootprint";

export const createCarbonFooprintAnswer = async (
  answer: ConvertedCarbonFootprintAnswer,
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

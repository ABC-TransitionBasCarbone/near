import { type Survey } from "@prisma/client";
import { db } from "../db";
import { type ConvertedCarbonFootprintAnswer } from "~/types/CarbonFootprint";
import { getCalculatedSuParams } from "../su/get";

export const createCarbonFooprintAnswer = async (
  answer: ConvertedCarbonFootprintAnswer,
  survey: Survey,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { su, neighborhood, ...createQuery } = answer;

  const calculatedSuParams = await getCalculatedSuParams(survey, answer);

  return db.carbonFootprintAnswer.create({
    data: { ...createQuery, surveyId: survey.id, ...calculatedSuParams },
  });
};

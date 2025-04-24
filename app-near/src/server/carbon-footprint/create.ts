import { type Survey } from "@prisma/client";
import { db } from "../db";
import { type ConvertedCarbonFootprintAnswer } from "~/types/CarbonFootprint";
import { getCalculatedSu, getSuIdFromSuNameOrThrow } from "../su/get";

export const createCarbonFooprintAnswer = async (
  answer: ConvertedCarbonFootprintAnswer,
  survey: Survey,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { su, neighborhood, ...createQuery } = answer;

  const calculatedSu = answer.knowSu
    ? { suId: await getSuIdFromSuNameOrThrow(survey.id, answer) }
    : await getCalculatedSu(survey, answer);

  return db.carbonFootprintAnswer.create({
    data: { ...createQuery, surveyId: survey.id, ...calculatedSu },
  });
};

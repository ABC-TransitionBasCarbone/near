import { db } from "../db";

export const countCarbonFootprintAnswers = async (
  surveyId: number,
): Promise<number> => {
  return db.carbonFootprintAnswer.count({ where: { surveyId } });
};

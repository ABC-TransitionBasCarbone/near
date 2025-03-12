import { db } from "../db";

export const countWayOfLifeAnswers = async (
  surveyId: number,
): Promise<number> => {
  return db.wayOfLifeAnswer.count({ where: { surveyId } });
};

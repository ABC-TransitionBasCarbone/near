import { db } from "../../db";

export const countAnswsers = async (surveyId: number): Promise<number> => {
  return await db.suAnswer.count({ where: { surveyId } });
};

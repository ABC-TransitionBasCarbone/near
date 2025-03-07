import { db } from "../db";

export const getWayOfLifeAnswerByEmail = async (email: string) => {
  return db.wayOfLifeAnswer.findUnique({ where: { email } });
};

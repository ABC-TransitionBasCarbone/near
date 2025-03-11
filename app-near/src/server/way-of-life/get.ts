import { db } from "../db";

export const getWayOfLifeAnswerByEmail = async (email: string) => {
  return db.wayOfLifeAnswer.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
};

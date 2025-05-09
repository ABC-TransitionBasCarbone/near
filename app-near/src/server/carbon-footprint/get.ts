import { db } from "../db";

export const getCarbonFootprintAnswerByEmail = async (email: string) => {
  return db.carbonFootprintAnswer.findFirst({
    where: { email },
    orderBy: { createdAt: "desc" },
  });
};

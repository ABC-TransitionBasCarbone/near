import { db } from "../db";

export const getCarbonFootprintAnswerByEmail = async (email: string) => {
  return db.carbonFootprintAnswer.findUnique({ where: { email } });
};

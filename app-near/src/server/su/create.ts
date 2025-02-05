import { type SuAnswer } from "@prisma/client";
import { db } from "../db";

export const createSu = async (answer: SuAnswer) => {
  return db.suAnswer.create({
    data: answer,
  });
};

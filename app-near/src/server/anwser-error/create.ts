import { type AnswerType } from "@prisma/client";
import { db } from "../db";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAnswerError = async (rawPayload: any, type: AnswerType) => {
  await db.rawAnswerError.create({
    data: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      rawPayload,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      answerType: type,
    },
  });

  return;
};

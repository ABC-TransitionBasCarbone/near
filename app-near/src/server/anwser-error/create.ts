import { type AnswerType } from "@prisma/client";
import { db } from "../db";
import { type InputJsonValue } from "@prisma/client/runtime/library";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createAnswerError = async (rawPayload: any, type: AnswerType) => {
  return await db.rawAnswerError.create({
    data: {
      rawPayload: rawPayload as InputJsonValue,
      answerType: type,
    },
  });
};

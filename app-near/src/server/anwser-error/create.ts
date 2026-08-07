import { type AnswerType } from "@prisma/client";
import { db } from "../db";
import { type InputJsonValue } from "@prisma/client/runtime/library";

export const createAnswerError = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawPayload: any,
  type: AnswerType,
  errorMessage?: string,
) => {
  return await db.rawAnswerError.create({
    data: {
      rawPayload: rawPayload as InputJsonValue,
      answerType: type,
      errorMessage,
    },
  });
};

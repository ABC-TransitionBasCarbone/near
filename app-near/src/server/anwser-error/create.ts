import { AnswerErrorStatus, type AnswerType } from "@prisma/client";
import { db } from "../db";
import { type InputJsonValue } from "@prisma/client/runtime/library";

export const createAnswerError = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawPayload: any,
  type: AnswerType,
  errorMessage?: string,
  externalId?: string,
) => {
  if (externalId) {
    const existing = await db.rawAnswerError.findFirst({
      where: {
        externalId,
        answerType: type,
        status: AnswerErrorStatus.ACTIVE,
      },
    });

    if (existing) {
      return db.rawAnswerError.update({
        where: { id: existing.id },
        data: {
          rawPayload: rawPayload as InputJsonValue,
          errorMessage,
          retryCount: { increment: 1 },
          lastAttemptAt: new Date(),
        },
      });
    }
  }

  return db.rawAnswerError.create({
    data: {
      rawPayload: rawPayload as InputJsonValue,
      answerType: type,
      errorMessage,
      externalId,
    },
  });
};

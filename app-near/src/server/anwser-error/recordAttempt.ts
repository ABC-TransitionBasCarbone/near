import { AnswerErrorStatus } from "@prisma/client";
import { db } from "../db";

type AttemptResult =
  { success: true } | { success: false; errorMessage: string };

export const recordAnswerErrorAttempt = async (
  id: number,
  result: AttemptResult,
) => {
  const now = new Date();

  return db.rawAnswerError.update({
    where: { id },
    data: {
      retryCount: { increment: 1 },
      lastAttemptAt: now,
      ...(result.success
        ? {
            status: AnswerErrorStatus.RESOLVED,
            resolvedAt: now,
            errorMessage: null,
          }
        : {
            status: AnswerErrorStatus.ACTIVE,
            errorMessage: result.errorMessage,
          }),
    },
  });
};

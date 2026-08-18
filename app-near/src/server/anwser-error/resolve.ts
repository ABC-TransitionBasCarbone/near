import { AnswerErrorStatus, type AnswerType } from "@prisma/client";
import { db } from "../db";

export const resolveAnswerErrorsByExternalId = async (
  externalId: string | undefined,
  type: AnswerType,
) => {
  if (!externalId) return;

  await db.rawAnswerError.updateMany({
    where: { externalId, answerType: type, status: AnswerErrorStatus.ACTIVE },
    data: {
      status: AnswerErrorStatus.RESOLVED,
      resolvedAt: new Date(),
      comment:
        "Auto-resolved: a valid answer was received before this error was replayed",
    },
  });
};

import { AnswerErrorStatus, type AnswerType } from "@prisma/client";
import { db } from "../db";

export const listActiveAnswerErrors = async (answerType?: AnswerType) => {
  return db.rawAnswerError.findMany({
    where: {
      status: AnswerErrorStatus.ACTIVE,
      ...(answerType ? { answerType } : {}),
    },
    orderBy: { id: "asc" },
  });
};

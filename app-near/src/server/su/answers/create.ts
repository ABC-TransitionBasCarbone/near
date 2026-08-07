import { type SuAnswer } from "@prisma/client";
import { db } from "../../db";

// SuAnswer.typeformId's Prisma default, only meant for historical rows created before
// this field existed; a new payload should always carry a real typeform token
const UNKNOWN_TYPEFORM_ID = "unknown";

export const createSu = async (answer: SuAnswer, surveyName: string) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  if (answer.typeformId === UNKNOWN_TYPEFORM_ID) {
    throw new Error("missing typeformId");
  }

  const existing = await db.suAnswer.findFirst({
    where: { typeformId: answer.typeformId },
  });
  if (existing) {
    return existing;
  }

  return db.suAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

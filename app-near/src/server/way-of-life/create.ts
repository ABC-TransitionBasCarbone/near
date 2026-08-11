import { type Survey, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "../db";
import { type BuilderWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

// WayOfLifeAnswer.typeformId's Prisma default, only meant for historical rows created before
// this field existed; a new payload should always carry a real typeform token
const UNKNOWN_TYPEFORM_ID = "unknown";

const createWayOfLifeAnswer = async (
  answer: WayOfLifeAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  if (!answer.typeformId || answer.typeformId === UNKNOWN_TYPEFORM_ID) {
    throw new Error("missing typeformId");
  }

  const existing = await db.wayOfLifeAnswer.findFirst({
    where: { typeformId: answer.typeformId },
  });
  if (existing) {
    return existing;
  }

  return db.wayOfLifeAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

export const handleWayOfLifeCreation = async (
  data: BuilderWayOfLifeAnswer,
  survey: Survey,
) => {
  await createWayOfLifeAnswer(
    {
      ...data,
    } as WayOfLifeAnswer,
    survey.name,
  );
};

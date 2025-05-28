import { type Survey, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "../db";
import { type BuilderWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

const createWayOfLifeAnswer = async (
  answer: WayOfLifeAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
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

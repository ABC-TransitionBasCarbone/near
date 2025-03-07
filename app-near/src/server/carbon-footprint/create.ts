import { type CarbonFootprintAnswer } from "@prisma/client";
import { db } from "../db";

export const createCarbonFooprintAnswer = async (
  answer: CarbonFootprintAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  if (answer.email) {
    const userAlreadyExist = await db.carbonFootprintAnswer.findFirst({
      where: {
        email: answer.email,
      },
    });

    if (userAlreadyExist) {
      throw new Error("user email already exist");
    }
  }

  return db.carbonFootprintAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

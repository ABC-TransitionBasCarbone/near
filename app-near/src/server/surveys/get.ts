import { db } from "../db";

export const getOneSurvey = async (id: number) => {
  return db.survey.findFirst({
    where: { id },
    include: {
      quartier: true,
    },
  });
};

export const getOneSurveyByName = async (name: string) => {
  return db.survey.findFirst({
    where: { name },
  });
};

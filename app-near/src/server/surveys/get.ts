import { db } from "../db";

export const getOneSurvey = async (id: number) => {
  return db.survey.findFirst({
    where: { id },
    include: {
      quartier: true,
    },
  });
};

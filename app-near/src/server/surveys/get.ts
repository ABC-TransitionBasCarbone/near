import { db } from "../db";

export const getOneSurvey = async (id: number) => {
  return db.survey.findUniqueOrThrow({ where: { id } });
};

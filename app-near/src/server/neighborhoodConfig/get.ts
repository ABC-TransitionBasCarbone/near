import { db } from "../db";

export const getOneNeighborhoodConfig = async (surveyId: number) => {
  return db.neighborhoodConfig.findUnique({ where: { surveyId } });
};

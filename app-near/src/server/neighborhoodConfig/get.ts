import { db } from "../db";

export const getOneNeighborhoodConfig = async (surveyId: number) => {
  return db.neighborhoodConfig.findUnique({ where: { surveyId } });
};

export const neighborhoodConfigIsCompleted = async (surveyId: number) => {
  const neighborhoodConfig = await getOneNeighborhoodConfig(surveyId);

  if (!neighborhoodConfig) return false;
  return Object.values(neighborhoodConfig).every((value) => value);
};

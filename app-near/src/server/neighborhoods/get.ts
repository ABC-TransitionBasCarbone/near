import { db } from "../db";

export const getOneNeighborhood = async (id: number) => {
  return db.quartier.findUniqueOrThrow({ where: { surveyId: id } });
};

import { db } from "../db";

export const getOneNeighborood = async (id: number) => {
  return db.quartier.findUniqueOrThrow({ where: { surveyId: id } });
};

import { db } from "../db";
import { type NeighborhoodConfigFormValues } from "~/schemas/neighborhood-config";

export const upsertNeighborhoodConfig = async (
  surveyId: number,
  config: NeighborhoodConfigFormValues,
) => {
  return db.neighborhoodConfig.upsert({
    where: { surveyId },
    update: config,
    create: { id: undefined, surveyId, ...config },
  });
};

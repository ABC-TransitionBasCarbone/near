import { db } from "~/server/db";

export const getSuVolumes = async (surveyId: number) => {
  return db.suData.findMany({
    where: { surveyId },
    select: { su: true, popPercentage: true },
  });
};

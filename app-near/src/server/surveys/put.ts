import { db } from "../db";
import { type SurveyPhase } from "@prisma/client";

export const updateSurvey = async (
  id: number,
  data: Partial<{ phase: SurveyPhase }>,
) => {
  return db.survey.update({
    where: { id },
    data,
  });
};

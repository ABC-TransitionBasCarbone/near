import { db } from "~/server/db";
import { buildCsv } from "~/server/utils/csv";

export const buildCSVFromCarbonFootprintAnswers = async (
  surveyId: number,
): Promise<string> => {
  const answers = await db.carbonFootprintAnswer.findMany({
    where: { surveyId },
    orderBy: { id: "asc" },
    select: {
      email: true,
      su: { select: { suBank: true } },
    },
  });

  return buildCsv(answers, (answer) => ({
    SU: answer.su?.suBank?.name,
    Email: answer.email,
  }));
};

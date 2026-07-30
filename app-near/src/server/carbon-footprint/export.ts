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
      su: true,
    },
  });

  return buildCsv(answers, (answer) => ({
    SU: answer.su?.su,
    Email: answer.email,
  }));
};

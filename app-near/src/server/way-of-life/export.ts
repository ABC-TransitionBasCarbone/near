import { db } from "~/server/db";
import { buildCsv } from "~/server/utils/csv";

export const buildCSVFromWayOfLifeAnswers = async (
  surveyId: number,
): Promise<string> => {
  const answers = await db.wayOfLifeAnswer.findMany({
    where: { surveyId },
    orderBy: { id: "asc" },
    select: {
      email: true,
      ageCategory: true,
      gender: true,
      su: true,
    },
  });

  return buildCsv(answers, (answer) => ({
    SU: answer.su?.su,
    Email: answer.email,
    Age: answer.ageCategory,
    Genre: answer.gender,
  }));
};

import { db } from "~/server/db";
import { buildCsv } from "~/server/utils/csv";

export const buildCSVFromSUAnswers = async (
  surveyId: number,
): Promise<string> => {
  const suAnswers = await db.suAnswer.findMany({
    where: { surveyId },
    orderBy: { id: "asc" },
    select: {
      email: true,
      gender: true,
      ageCategory: true,
      professionalCategory: true,
      su: true,
    },
  });

  return buildCsv(suAnswers, (answer) => ({
    Email: answer.email,
    Genre: answer.gender,
    Age: answer.ageCategory,
    CSP: answer.professionalCategory,
    SU: answer.su?.su,
  }));
};

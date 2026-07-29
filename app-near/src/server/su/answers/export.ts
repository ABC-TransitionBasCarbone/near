import Papa from "papaparse";
import { db } from "~/server/db";

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

  const convertedSUAnswers = suAnswers.map((answer) => ({
    Email: answer.email,
    Genre: answer.gender,
    Age: answer.ageCategory,
    CSP: answer.professionalCategory,
    SU: answer.su?.su,
  }));

  return Papa.unparse(convertedSUAnswers);
};

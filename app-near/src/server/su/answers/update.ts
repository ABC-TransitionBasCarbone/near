import { db } from "~/server/db";
import { type AnswerAttributedSuWithId } from "~/types/SuDetection";

export const updateSuAnswerWithSu = async (
  surveyId: number,
  answers: AnswerAttributedSuWithId[],
) => {
  return await Promise.all(
    answers.map(async ({ id, su, distanceToBarycenter }) => {
      const suData = await db.suData.findUnique({
        where: { surveyId_su: { surveyId, su } },
      });
      if (!suData)
        throw new Error(
          "Trying to add su to suAnswer without suData being created.",
        );
      return db.suAnswer.update({
        where: { id },
        data: { suId: suData.id, distanceToBarycenter },
      });
    }),
  );
};

import { db } from "~/server/db";
import { type AnswerAttributedSuWithId } from "~/types/SuDetection";

export const updateSuAnswerWithSu = async (
  surveyId: number,
  answers: AnswerAttributedSuWithId[],
) => {
  for (const answer of answers) {
    const { id, su, distanceToBarycenter } = answer;

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
  }
};

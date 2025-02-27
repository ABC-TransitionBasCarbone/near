import { db } from "~/server/db";
import { type AnswerAttributedSuWithId } from "~/types/SuDetection";

export const updateAfterSUDetection = async (
  answers: AnswerAttributedSuWithId[],
) => {
  await Promise.all(
    answers.map(({ id, su, distanceToBarycenter }) =>
      db.suAnswer.update({
        where: { id },
        data: { suId: su, distanceToBarycenter },
      }),
    ),
  );
};

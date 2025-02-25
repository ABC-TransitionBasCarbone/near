import { db } from "~/server/db";

export const updateAfterSUDetection = async (
  answers: { id: number; su: number; distanceToBarycenter: number }[],
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

import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import { chunkArray } from "~/server/utils/arrays";
import { ErrorCode } from "~/types/enums/error";
import { type AnswerAttributedSuWithId } from "~/types/SuDetection";

export const updateSuAnswerWithSu = async (
  surveyId: number,
  answers: AnswerAttributedSuWithId[],
) => {
  const suDataList = await db.suData.findMany({
    where: {
      surveyId,
    },
  });

  const suSuIdMapper = new Map(suDataList.map((s) => [s.su, s.id]));

  const missingSuInDatabase = answers.some((a) => !suSuIdMapper.has(a.su));
  if (missingSuInDatabase) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.SU_NOT_FOUND,
    });
  }

  const chunks = chunkArray(answers, 5);

  for (const group of chunks) {
    await Promise.all(
      group.map(({ id, su, distanceToBarycenter }) =>
        db.suAnswer.update({
          where: { id },
          data: {
            suId: suSuIdMapper.get(su),
            distanceToBarycenter,
          },
        }),
      ),
    );
  }
};

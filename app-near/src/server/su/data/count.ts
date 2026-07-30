import { db } from "~/server/db";
import { type SuCount } from "~/types/SuCount";

export const countBySu = async (surveyId: number): Promise<SuCount[]> => {
  const suData = await db.suData.findMany({
    where: { surveyId },
    select: {
      id: true,
      su: true,
      popPercentage: true,
      _count: {
        select: {
          carbonFootprintAnswer: true,
          wayOfLifeAnswer: true,
        },
      },
    },
  });

  return suData.map(({ id, su, popPercentage, _count }) => ({
    id,
    su,
    popPercentage,
    carbonFootprintAnswerCount: _count.carbonFootprintAnswer,
    wayOfLifeAnswerCount: _count.wayOfLifeAnswer,
  }));
};

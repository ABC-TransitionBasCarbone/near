import { db } from "~/server/db";
import { type SuInfo } from "~/types/Dataviz";

export const getSuInfo = async (surveyId: number): Promise<SuInfo[] | null> => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });
  if (!survey?.computedSu) {
    return null;
  }

  const [su, neighborhood] = await Promise.all([
    db.suData.findMany({
      where: { surveyId: survey.id },
      select: { id: true, suBank: true, su: true, popPercentage: true },
    }),
    db.quartier.findUnique({
      where: { surveyId: survey.id },
      select: { population_sum: true },
    }),
  ]);

  return su.map((item) => ({
    id: item.id,
    icon: item.suBank?.icon1 ?? "",
    popPercentage: item.popPercentage,
    realPopulation: Math.round(
      (item.popPercentage / 100) * (neighborhood?.population_sum ?? 0),
    ),
    bankData: item.suBank,
    su: item.su,
  }));
};

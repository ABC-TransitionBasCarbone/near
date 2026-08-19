import { db } from "~/server/db";

export type SuSelection = { isNeighborhood: boolean; suId: number | undefined };

export const resolveSuId = async (
  surveyId: number,
  selectedSus: number[] | undefined,
): Promise<SuSelection> => {
  const isNeighborhood = selectedSus?.length !== 1;
  if (isNeighborhood) return { isNeighborhood, suId: undefined };

  const su = await db.suData.findFirst({
    where: { surveyId, su: selectedSus[0] },
    select: { id: true },
  });
  return { isNeighborhood, suId: su?.id };
};

export type WeightedSu = { id: number; weight: number };

export const getWeightedSus = async (
  surveyId: number,
): Promise<WeightedSu[]> => {
  const sus = await db.suData.findMany({
    where: { surveyId },
    select: { id: true, popPercentage: true },
  });
  return sus
    .map((su) => ({ id: su.id, weight: su.popPercentage / 100 }))
    .filter((su) => su.weight > 0);
};

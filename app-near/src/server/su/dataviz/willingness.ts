import { WishesChoices } from "@prisma/client";
import { db } from "~/server/db";

type WillingnessField =
  | "wantToReduceCarUsage"
  | "wantToReduceMeatAndFish"
  | "preferBuyFrenchAndSeasonFood"
  | "preferSecondHand";

const QUESTIONS: Record<WillingnessField, { title: string; emoji: string }> = {
  wantToReduceCarUsage: { title: "Réduire l'usage de la voiture", emoji: "🚗" },
  wantToReduceMeatAndFish: { title: "Réduire viande et poisson", emoji: "🥩" },
  preferBuyFrenchAndSeasonFood: {
    title: "Privilégier produits locaux et de saison",
    emoji: "🥕",
  },
  preferSecondHand: { title: "Privilégier la seconde main", emoji: "♻️" },
};

const CHOICE_LABELS: Record<WishesChoices, string> = {
  [WishesChoices.YES_I_DO]: "Le fait déjà",
  [WishesChoices.I_WISH_AND_IT_IS_PLAN]: "Le prévoit",
  [WishesChoices.I_WISH_BUT_CANT]: "Aimerait mais ne peut pas",
  [WishesChoices.NO]: "Pas intéressé·e",
};

const WILLINGNESS_SELECT = Object.fromEntries(
  Object.keys(QUESTIONS).map((f) => [f, true]),
) as Record<WillingnessField, true>;

export type WillingnessQuestionResult = {
  field: string;
  title: string;
  emoji: string;
  totalResponses: number;
  responses: {
    choice: WishesChoices;
    label: string;
    count: number;
    percentage: number;
  }[];
};

export type WillingnessResult = {
  data: WillingnessQuestionResult[];
  isNeighborhood: boolean;
};

const toPercentage = (count: number, total: number) =>
  total > 0 ? Math.round((count / total) * 1000) / 10 : 0;

const countByField = (
  answers: Record<WillingnessField, WishesChoices>[],
): Record<WillingnessField, Record<WishesChoices, number>> => {
  const counts = Object.fromEntries(
    Object.keys(QUESTIONS).map((field) => [
      field,
      { NO: 0, I_WISH_BUT_CANT: 0, I_WISH_AND_IT_IS_PLAN: 0, YES_I_DO: 0 },
    ]),
  ) as Record<WillingnessField, Record<WishesChoices, number>>;

  for (const answer of answers) {
    for (const field of Object.keys(QUESTIONS) as WillingnessField[]) {
      counts[field][answer[field]]++;
    }
  }
  return counts;
};

const toQuestionResults = (
  counts: Record<WillingnessField, Record<WishesChoices, number>>,
): WillingnessQuestionResult[] =>
  (
    Object.entries(QUESTIONS) as [
      WillingnessField,
      { title: string; emoji: string },
    ][]
  ).map(([field, question]) => {
    const fieldCounts = counts[field];
    const totalResponses = Object.values(fieldCounts).reduce(
      (s, n) => s + n,
      0,
    );
    return {
      field,
      title: question.title,
      emoji: question.emoji,
      totalResponses,
      responses: (Object.values(WishesChoices) as WishesChoices[]).map(
        (choice) => ({
          choice,
          label: CHOICE_LABELS[choice],
          count: fieldCounts[choice],
          percentage: toPercentage(fieldCounts[choice], totalResponses),
        }),
      ),
    };
  });

export const getWillingness = async (
  surveyId: number,
  selectedSus?: number[],
): Promise<WillingnessResult> => {
  const isNeighborhood = selectedSus?.length !== 1;

  if (!isNeighborhood) {
    const su = await db.suData.findFirst({
      where: { surveyId, su: selectedSus[0] },
      select: { id: true },
    });
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId: su?.id },
      select: WILLINGNESS_SELECT,
    });
    return {
      isNeighborhood: false,
      data: toQuestionResults(countByField(answers)),
    };
  }

  // Neighborhood view: population-weighted average of each SU's own counts.
  const sus = await db.suData.findMany({
    where: { surveyId },
    select: { id: true, popPercentage: true },
  });

  const weighted = Object.fromEntries(
    Object.keys(QUESTIONS).map((field) => [
      field,
      { NO: 0, I_WISH_BUT_CANT: 0, I_WISH_AND_IT_IS_PLAN: 0, YES_I_DO: 0 },
    ]),
  ) as Record<WillingnessField, Record<WishesChoices, number>>;

  for (const su of sus) {
    const weight = su.popPercentage / 100;
    if (weight <= 0) continue;
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId: su.id },
      select: WILLINGNESS_SELECT,
    });
    if (answers.length === 0) continue;
    const suCounts = countByField(answers);
    for (const field of Object.keys(QUESTIONS) as WillingnessField[]) {
      for (const choice of Object.values(WishesChoices) as WishesChoices[]) {
        weighted[field][choice] += suCounts[field][choice] * weight;
      }
    }
  }

  const rounded = Object.fromEntries(
    Object.entries(weighted).map(([field, counts]) => [
      field,
      Object.fromEntries(
        Object.entries(counts).map(([choice, n]) => [choice, Math.round(n)]),
      ),
    ]),
  ) as Record<WillingnessField, Record<WishesChoices, number>>;

  return { isNeighborhood: true, data: toQuestionResults(rounded) };
};

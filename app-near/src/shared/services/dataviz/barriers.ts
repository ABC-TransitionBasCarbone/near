export type BarrierField =
  | "reasonsToContinueUsingCar"
  | "reasonsToEatMeat"
  | "reasonsToNotBuyFrenchAndSeasonFood"
  | "reasonsToNotChoseSecondHand";

export const NOT_CONCERNED_KEY = "NOT_CONCERNED";

export const BARRIER_QUESTIONS: Record<
  BarrierField,
  { title: string; emoji: string }
> = {
  reasonsToContinueUsingCar: {
    title: "Pourquoi continuez-vous à utiliser la voiture ?",
    emoji: "🚗",
  },
  reasonsToEatMeat: {
    title: "Pourquoi continuez-vous à manger de la viande ?",
    emoji: "🥩",
  },
  reasonsToNotBuyFrenchAndSeasonFood: {
    title: "Pourquoi n'achetez-vous pas plus local et de saison ?",
    emoji: "🥕",
  },
  reasonsToNotChoseSecondHand: {
    title: "Pourquoi ne choisissez-vous pas la seconde main ?",
    emoji: "♻️",
  },
};

export const BARRIER_FIELDS: BarrierField[] = Object.keys(
  BARRIER_QUESTIONS,
) as BarrierField[];

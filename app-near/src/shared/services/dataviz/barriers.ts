export type BarrierField =
  | "reasonsToContinueUsingCar"
  | "reasonsToEatMeat"
  | "reasonsToNotBuyFrenchAndSeasonFood"
  | "reasonsToNotChoseSecondHand";

export const BARRIER_QUESTIONS: Record<
  BarrierField,
  { title: string; emoji: string }
> = {
  reasonsToContinueUsingCar: {
    title: "Barrière à l'usage d'autres modes que la voiture",
    emoji: "🚗",
  },
  reasonsToEatMeat: {
    title: "Barrière à la réduction de la consommation de viande",
    emoji: "🥩",
  },
  reasonsToNotBuyFrenchAndSeasonFood: {
    title: "Barrières à une alimentation locale et de saison",
    emoji: "🍎",
  },
  reasonsToNotChoseSecondHand: {
    title: "Barrière à l'achat d'occasion et la réparation",
    emoji: "🔁",
  },
};

export const BARRIER_FIELDS: BarrierField[] = Object.keys(
  BARRIER_QUESTIONS,
) as BarrierField[];

export type BarrierFamily =
  | "Accessibilité financière"
  | "Image et sociabilité"
  | "Manque de confiance"
  | "Informations et compétences"
  | "Temps & Organisation"
  | "Accessibilité pratique"
  | "Autres raisons"
  | "Non concerné";

export const BARRIER_FAMILIES: Record<BarrierFamily, { emoji: string }> = {
  "Accessibilité financière": { emoji: "💰" },
  "Image et sociabilité": { emoji: "🤵" },
  "Manque de confiance": { emoji: "🤔" },
  "Informations et compétences": { emoji: "🤷" },
  "Temps & Organisation": { emoji: "⌛" },
  "Accessibilité pratique": { emoji: "🔭" },
  "Autres raisons": { emoji: "💬" },
  "Non concerné": { emoji: "🚫" },
};

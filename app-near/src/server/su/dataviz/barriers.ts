import {
  ReasonsUsingCar,
  ReasonsToEatMeat,
  ReasonsToNotBuyFrenchSeasonFood,
  ReasonsToNotChoseSecondHand,
} from "@prisma/client";
import { db } from "~/server/db";
import {
  type BarrierField,
  BARRIER_FIELDS,
  BARRIER_QUESTIONS,
} from "~/shared/services/dataviz/barriers";
import { resolveSuId } from "~/server/su/dataviz/suSelection";

export type { BarrierField };
export { BARRIER_QUESTIONS };

type ReasonLabel = { label: string; emoji: string };

const REASONS_USING_CAR_LABELS: Record<ReasonsUsingCar, ReasonLabel> = {
  [ReasonsUsingCar.HANDICAP_REASONS]: {
    label: "Raisons de handicap",
    emoji: "♿",
  },
  [ReasonsUsingCar.I_NEED_CAR_FOR_SOME_ACTIONS]: {
    label: "Besoin pour certains trajets",
    emoji: "🚗",
  },
  [ReasonsUsingCar.SECURITY_REASONS]: {
    label: "Raisons de sécurité",
    emoji: "🔒",
  },
  [ReasonsUsingCar.MY_WORK]: {
    label: "Nécessaire pour le travail",
    emoji: "💼",
  },
  [ReasonsUsingCar.PROFESSIONAL_OR_PERSONAL_IMAGE]: {
    label: "Image professionnelle ou personnelle",
    emoji: "🎩",
  },
  [ReasonsUsingCar.NO_PUBLIC_TRANSPORT_AT_PROXIMITY]: {
    label: "Pas de transport en commun à proximité",
    emoji: "🚫🚌",
  },
  [ReasonsUsingCar.NOT_CONCERNED]: { label: "Non concerné·e", emoji: "🤷" },
};

const REASONS_TO_EAT_MEAT_LABELS: Record<ReasonsToEatMeat, ReasonLabel> = {
  [ReasonsToEatMeat.WITHOUT_MEAT_IS_NOT_NOURISHING_ENOUGH]: {
    label: "Pas assez nourrissant sans viande",
    emoji: "🍽️",
  },
  [ReasonsToEatMeat.MY_FAMILY_EAT_MEAT]: {
    label: "Ma famille mange de la viande",
    emoji: "👨‍👩‍👧",
  },
  [ReasonsToEatMeat.I_DONT_KNOW_ALTERNATIVES]: {
    label: "Je ne connais pas les alternatives",
    emoji: "❓",
  },
  [ReasonsToEatMeat.I_DONT_TRUST_ALTERNATIVES]: {
    label: "Je ne fais pas confiance aux alternatives",
    emoji: "🚫",
  },
  [ReasonsToEatMeat.RESTAURANTS_DOES_NOT_OFFER_ALTERNATIVES]: {
    label: "Peu d'alternatives au restaurant",
    emoji: "🍽️",
  },
  [ReasonsToEatMeat.NOT_CONCERNED]: { label: "Non concerné·e", emoji: "🤷" },
};

const REASONS_TO_NOT_BUY_FRENCH_SEASON_FOOD_LABELS: Record<
  ReasonsToNotBuyFrenchSeasonFood,
  ReasonLabel
> = {
  [ReasonsToNotBuyFrenchSeasonFood.PRICE]: { label: "Prix", emoji: "💰" },
  [ReasonsToNotBuyFrenchSeasonFood.COMPLICATED_LABELS]: {
    label: "Étiquetage compliqué",
    emoji: "🏷️",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_MARKET]: {
    label: "Je ne connais pas le marché",
    emoji: "❓",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_SEASON_PRODUCTS]: {
    label: "Je ne connais pas les produits de saison",
    emoji: "📅",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_PREFER_EAT_OTHER_PRODUCTS]: {
    label: "Je préfère d'autres produits",
    emoji: "🍽️",
  },
};

const REASONS_TO_NOT_CHOSE_SECOND_HAND_LABELS: Record<
  ReasonsToNotChoseSecondHand,
  ReasonLabel
> = {
  [ReasonsToNotChoseSecondHand.TRUST]: {
    label: "Manque de confiance",
    emoji: "🤔",
  },
  [ReasonsToNotChoseSecondHand.TIME_CONSUMING]: {
    label: "Prend trop de temps",
    emoji: "⏱️",
  },
  [ReasonsToNotChoseSecondHand.PROFESSIONAL_OR_PERSONAL_IMAGE]: {
    label: "Image professionnelle ou personnelle",
    emoji: "🎩",
  },
  [ReasonsToNotChoseSecondHand.COMPETENCIES]: {
    label: "Manque de compétences",
    emoji: "🧠",
  },
  [ReasonsToNotChoseSecondHand.NO_OFFER_AT_PROXIMITY]: {
    label: "Pas d'offre à proximité",
    emoji: "📍",
  },
  [ReasonsToNotChoseSecondHand.NOT_CONCERNED]: {
    label: "Non concerné·e",
    emoji: "🤷",
  },
};

const REASON_LABELS: Record<BarrierField, Record<string, ReasonLabel>> = {
  reasonsToContinueUsingCar: REASONS_USING_CAR_LABELS,
  reasonsToEatMeat: REASONS_TO_EAT_MEAT_LABELS,
  reasonsToNotBuyFrenchAndSeasonFood:
    REASONS_TO_NOT_BUY_FRENCH_SEASON_FOOD_LABELS,
  reasonsToNotChoseSecondHand: REASONS_TO_NOT_CHOSE_SECOND_HAND_LABELS,
};

export type BarrierChoiceResult = {
  key: string;
  label: string;
  emoji: string;
  percentage: number;
};

export type BarrierQuestionResult = {
  field: string;
  title: string;
  emoji: string;
  totalResponses: number;
  choices: BarrierChoiceResult[];
};

const BARRIER_SELECT = {
  reasonsToContinueUsingCar: true,
  reasonsToEatMeat: true,
  reasonsToNotBuyFrenchAndSeasonFood: true,
  reasonsToNotChoseSecondHand: true,
} as const;

type BarrierAnswer = Record<BarrierField, string[]>;

const computeForField = (
  field: BarrierField,
  answers: BarrierAnswer[],
): BarrierQuestionResult => {
  const counts: Record<string, number> = {};
  let totalResponses = 0;
  for (const answer of answers) {
    const values = answer[field];
    if (values.length === 0) continue;
    totalResponses++;
    for (const v of values) counts[v] = (counts[v] ?? 0) + 1;
  }

  const choices = Object.entries(REASON_LABELS[field]).map(([key, meta]) => ({
    key,
    label: meta.label,
    emoji: meta.emoji,
    percentage:
      totalResponses > 0
        ? Math.round(((counts[key] ?? 0) / totalResponses) * 1000) / 10
        : 0,
  }));

  return {
    field,
    title: BARRIER_QUESTIONS[field].title,
    emoji: BARRIER_QUESTIONS[field].emoji,
    totalResponses,
    choices,
  };
};

export const getBarrierQuestion = async (
  surveyId: number,
  selectedSus: number[] | undefined,
  questionKey: BarrierField | "all",
): Promise<BarrierQuestionResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  const answers = await db.wayOfLifeAnswer.findMany({
    where: isNeighborhood ? { surveyId } : { surveyId, suId },
    select: BARRIER_SELECT,
  });

  if (questionKey !== "all") {
    return computeForField(questionKey, answers);
  }

  const perQuestion = BARRIER_FIELDS.map((field) =>
    computeForField(field, answers),
  );
  return {
    field: "all",
    title: "Toutes les barrières",
    emoji: "🧩",
    totalResponses: perQuestion.reduce((sum, q) => sum + q.totalResponses, 0),
    choices: perQuestion.flatMap((q) => q.choices),
  };
};

import { db } from "~/server/db";

export type BarrierField =
  | "reasonsToContinueUsingCar"
  | "reasonsToEatMeat"
  | "reasonsToNotBuyFrenchAndSeasonFood"
  | "reasonsToNotChoseSecondHand";

const BARRIER_FIELDS: BarrierField[] = [
  "reasonsToContinueUsingCar",
  "reasonsToEatMeat",
  "reasonsToNotBuyFrenchAndSeasonFood",
  "reasonsToNotChoseSecondHand",
];

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

const REASON_LABELS: Record<
  BarrierField,
  Record<string, { label: string; emoji: string }>
> = {
  reasonsToContinueUsingCar: {
    HANDICAP_REASONS: { label: "Raisons de handicap", emoji: "♿" },
    I_NEED_CAR_FOR_SOME_ACTIONS: {
      label: "Besoin pour certains trajets",
      emoji: "🚗",
    },
    SECURITY_REASONS: { label: "Raisons de sécurité", emoji: "🔒" },
    MY_WORK: { label: "Nécessaire pour le travail", emoji: "💼" },
    PROFESSIONAL_OR_PERSONAL_IMAGE: {
      label: "Image professionnelle ou personnelle",
      emoji: "🎩",
    },
    NO_PUBLIC_TRANSPORT_AT_PROXIMITY: {
      label: "Pas de transport en commun à proximité",
      emoji: "🚫🚌",
    },
    NOT_CONCERNED: { label: "Non concerné·e", emoji: "🤷" },
  },
  reasonsToEatMeat: {
    WITHOUT_MEAT_IS_NOT_NOURISHING_ENOUGH: {
      label: "Pas assez nourrissant sans viande",
      emoji: "🍽️",
    },
    MY_FAMILY_EAT_MEAT: { label: "Ma famille mange de la viande", emoji: "👨‍👩‍👧" },
    I_DONT_KNOW_ALTERNATIVES: {
      label: "Je ne connais pas les alternatives",
      emoji: "❓",
    },
    I_DONT_TRUST_ALTERNATIVES: {
      label: "Je ne fais pas confiance aux alternatives",
      emoji: "🚫",
    },
    RESTAURANTS_DOES_NOT_OFFER_ALTERNATIVES: {
      label: "Peu d'alternatives au restaurant",
      emoji: "🍽️",
    },
    NOT_CONCERNED: { label: "Non concerné·e", emoji: "🤷" },
  },
  reasonsToNotBuyFrenchAndSeasonFood: {
    PRICE: { label: "Prix", emoji: "💰" },
    COMPLICATED_LABELS: { label: "Étiquetage compliqué", emoji: "🏷️" },
    I_DONT_KNOW_MARKET: { label: "Je ne connais pas le marché", emoji: "❓" },
    I_DONT_KNOW_SEASON_PRODUCTS: {
      label: "Je ne connais pas les produits de saison",
      emoji: "📅",
    },
    I_PREFER_EAT_OTHER_PRODUCTS: {
      label: "Je préfère d'autres produits",
      emoji: "🍽️",
    },
  },
  reasonsToNotChoseSecondHand: {
    TRUST: { label: "Manque de confiance", emoji: "🤔" },
    TIME_CONSUMING: { label: "Prend trop de temps", emoji: "⏱️" },
    PROFESSIONAL_OR_PERSONAL_IMAGE: {
      label: "Image professionnelle ou personnelle",
      emoji: "🎩",
    },
    COMPETENCIES: { label: "Manque de compétences", emoji: "🧠" },
    NO_OFFER_AT_PROXIMITY: { label: "Pas d'offre à proximité", emoji: "📍" },
    NOT_CONCERNED: { label: "Non concerné·e", emoji: "🤷" },
  },
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
  const isNeighborhood = selectedSus?.length !== 1;

  let suId: number | undefined;
  if (!isNeighborhood) {
    const su = await db.suData.findFirst({
      where: { surveyId, su: selectedSus[0] },
      select: { id: true },
    });
    suId = su?.id;
  }

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

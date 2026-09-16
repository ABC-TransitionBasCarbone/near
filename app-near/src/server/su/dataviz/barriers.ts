import {
  ReasonsUsingCar,
  ReasonsToEatMeat,
  ReasonsToNotBuyFrenchSeasonFood,
  ReasonsToNotChoseSecondHand,
} from "@prisma/client";
import { db } from "~/server/db";
import {
  type BarrierField,
  type BarrierFamily,
  BARRIER_FIELDS,
  BARRIER_QUESTIONS,
  BARRIER_FAMILIES,
} from "~/shared/services/dataviz/barriers";
import { resolveSuId, getWeightedSus } from "~/server/su/dataviz/suSelection";

export type { BarrierField };
export { BARRIER_QUESTIONS };

type ReasonLabel = { label: string; emoji: string; family: BarrierFamily };

const REASONS_USING_CAR_LABELS: Record<ReasonsUsingCar, ReasonLabel> = {
  [ReasonsUsingCar.HANDICAP_REASONS]: {
    label:
      "L'accès aux transports en commun est difficile pour des raisons de handicap.",
    emoji: "👩‍🦽",
    family: "Accessibilité pratique",
  },
  [ReasonsUsingCar.I_NEED_CAR_FOR_SOME_ACTIONS]: {
    label:
      "J'ai besoin de la voiture pour certaines tâches quotidiennes (emmener les enfants à l'école, faire les courses en grande quantité, etc.)",
    emoji: "🛒",
    family: "Temps & Organisation",
  },
  [ReasonsUsingCar.SECURITY_REASONS]: {
    label:
      "J'ai peur pour ma sécurité avec les autres modes de transport (vélo, transports en commun, marche, etc.)",
    emoji: "🦺",
    family: "Manque de confiance",
  },
  [ReasonsUsingCar.MY_WORK]: {
    label:
      "Mon travail rend la voiture nécessaire (transport de matériel, besoin de flexibilité, etc.)",
    emoji: "💼",
    family: "Temps & Organisation",
  },
  [ReasonsUsingCar.PROFESSIONAL_OR_PERSONAL_IMAGE]: {
    label:
      "La voiture est importante pour mon image professionnelle et/ou sociale.",
    emoji: "🤵",
    family: "Image et sociabilité",
  },
  [ReasonsUsingCar.NO_PUBLIC_TRANSPORT_AT_PROXIMITY]: {
    label:
      "Je n'ai pas d'arrêt de transports en commun ou de gare à proximité de mon domicile.",
    emoji: "🚏",
    family: "Accessibilité pratique",
  },
  [ReasonsUsingCar.NOT_CONCERNED]: {
    label: "Ca ne me concerne pas.",
    emoji: "🚫",
    family: "Non concerné",
  },
};

const REASONS_TO_EAT_MEAT_LABELS: Record<ReasonsToEatMeat, ReasonLabel> = {
  [ReasonsToEatMeat.WITHOUT_MEAT_IS_NOT_NOURISHING_ENOUGH]: {
    label:
      "Je pense qu'une alimentation sans viande n'est pas assez nourrissante.",
    emoji: "💪",
    family: "Manque de confiance",
  },
  [ReasonsToEatMeat.MY_FAMILY_EAT_MEAT]: {
    label:
      "Dans mon entourage (famille, amis, ...), la viande est présente dans presque tous les repas.",
    emoji: "🍖",
    family: "Image et sociabilité",
  },
  [ReasonsToEatMeat.I_DONT_KNOW_ALTERNATIVES]: {
    label:
      "Je ne connais pas les alternatives à la viande (quels produits acheter, comment les cuisiner, etc.)",
    emoji: "🫘",
    family: "Informations et compétences",
  },
  [ReasonsToEatMeat.I_DONT_TRUST_ALTERNATIVES]: {
    label: "Je n'ai pas confiance dans les alternatives végétariennes.",
    emoji: "🫘",
    family: "Manque de confiance",
  },
  [ReasonsToEatMeat.RESTAURANTS_DOES_NOT_OFFER_ALTERNATIVES]: {
    label:
      "Les restaurants et cantines où je vais ne proposent pas de menu végétarien à mon goût.",
    emoji: "👨‍🍳",
    family: "Accessibilité pratique",
  },
  [ReasonsToEatMeat.NOT_CONCERNED]: {
    label: "Ca ne me concerne pas.",
    emoji: "🚫",
    family: "Non concerné",
  },
};

const REASONS_TO_NOT_BUY_FRENCH_SEASON_FOOD_LABELS: Record<
  ReasonsToNotBuyFrenchSeasonFood,
  ReasonLabel
> = {
  [ReasonsToNotBuyFrenchSeasonFood.PRICE]: {
    label:
      "Je prends le moins cher, je ne peux pas me permettre d'acheter ces produits.",
    emoji: "💰",
    family: "Accessibilité financière",
  },
  [ReasonsToNotBuyFrenchSeasonFood.COMPLICATED_LABELS]: {
    label:
      "C'est difficile de comprendre quand un produit est local et de saison ou non, les labels et étiquettes sont trompeurs et/ou compliqués.",
    emoji: "🏷️",
    family: "Informations et compétences",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_MARKET]: {
    label:
      "Je ne saurais pas dans quel magasin aller pour avoir des produits locaux et de saison.",
    emoji: "🏪",
    family: "Informations et compétences",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_SEASON_PRODUCTS]: {
    label: "Je ne connais pas les fruits et légumes de saison.",
    emoji: "🍒",
    family: "Informations et compétences",
  },
  [ReasonsToNotBuyFrenchSeasonFood.I_PREFER_EAT_OTHER_PRODUCTS]: {
    label: "Je préfère me cuisiner et/ou manger d'autres choses.",
    emoji: "🥑",
    family: "Manque de confiance",
  },
};

const REASONS_TO_NOT_CHOSE_SECOND_HAND_LABELS: Record<
  ReasonsToNotChoseSecondHand,
  ReasonLabel
> = {
  [ReasonsToNotChoseSecondHand.TRUST]: {
    label:
      "Pas confiance, peur que l'article ne soit pas fiable ou soit de faible qualité.",
    emoji: "🤔",
    family: "Manque de confiance",
  },
  [ReasonsToNotChoseSecondHand.TIME_CONSUMING]: {
    label: "L'achat d'occasion prend trop de temps.",
    emoji: "⌛",
    family: "Temps & Organisation",
  },
  [ReasonsToNotChoseSecondHand.PROFESSIONAL_OR_PERSONAL_IMAGE]: {
    label:
      "Les vêtements et objets neufs sont nécessaires pour mon image professionnelle et/ou sociale.",
    emoji: "🤵",
    family: "Image et sociabilité",
  },
  [ReasonsToNotChoseSecondHand.COMPETENCIES]: {
    label:
      "Je n'ai pas les compétences ni l'accès à des personnes compétentes pour réparer mes objets/vêtements.",
    emoji: "🤷",
    family: "Informations et compétences",
  },
  [ReasonsToNotChoseSecondHand.NO_OFFER_AT_PROXIMITY]: {
    label:
      "Je n'achète pas sur internet et/ou je n'ai pas de ressourcerie ou magasin d'occasions avec les articles dont j'ai besoin autour de chez moi.",
    emoji: "🔭",
    family: "Accessibilité pratique",
  },
  [ReasonsToNotChoseSecondHand.NOT_CONCERNED]: {
    label: "Ca ne me concerne pas.",
    emoji: "🚫",
    family: "Non concerné",
  },
};

const REASON_LABELS: Record<BarrierField, Record<string, ReasonLabel>> = {
  reasonsToContinueUsingCar: REASONS_USING_CAR_LABELS,
  reasonsToEatMeat: REASONS_TO_EAT_MEAT_LABELS,
  reasonsToNotBuyFrenchAndSeasonFood:
    REASONS_TO_NOT_BUY_FRENCH_SEASON_FOOD_LABELS,
  reasonsToNotChoseSecondHand: REASONS_TO_NOT_CHOSE_SECOND_HAND_LABELS,
};

const KNOWN_KEYS: Record<BarrierField, Set<string>> = Object.fromEntries(
  BARRIER_FIELDS.map((field) => [
    field,
    new Set(Object.keys(REASON_LABELS[field])),
  ]),
) as Record<BarrierField, Set<string>>;

const OTHER_KEY = "OTHER";
const OTHER_CHOICE_LABEL: ReasonLabel = {
  label: "Autre",
  emoji: "💬",
  family: "Autres raisons",
};

export type BarrierChoiceResult = {
  key: string;
  label: string;
  emoji: string;
  percentage: number;
  isNotConcerned?: boolean;
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

const round1 = (value: number) => Math.round(value * 10) / 10;

type FieldTally = {
  counts: Record<string, number>;
  otherCount: number;
  total: number;
};

const tallyField = (
  field: BarrierField,
  answers: BarrierAnswer[],
): FieldTally => {
  const counts: Record<string, number> = {};
  const known = KNOWN_KEYS[field];
  let otherCount = 0;
  for (const answer of answers) {
    let hasCustomReason = false;
    for (const v of answer[field]) {
      if (known.has(v)) {
        counts[v] = (counts[v] ?? 0) + 1;
      } else if (v.trim() !== "") {
        hasCustomReason = true;
      }
    }
    if (hasCustomReason) otherCount++;
  }
  return { counts, otherCount, total: answers.length };
};

const emptyTallies = (): Record<BarrierField, FieldTally> =>
  Object.fromEntries(
    BARRIER_FIELDS.map((field) => [
      field,
      { counts: {}, otherCount: 0, total: 0 },
    ]),
  ) as Record<BarrierField, FieldTally>;

const getTallies = async (
  surveyId: number,
  isNeighborhood: boolean,
  suId: number | undefined,
): Promise<Record<BarrierField, FieldTally>> => {
  if (!isNeighborhood) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId },
      select: BARRIER_SELECT,
    });
    return Object.fromEntries(
      BARRIER_FIELDS.map((field) => [field, tallyField(field, answers)]),
    ) as Record<BarrierField, FieldTally>;
  }

  const weightedSus = await getWeightedSus(surveyId);
  const acc = emptyTallies();

  for (const su of weightedSus) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId: su.id },
      select: BARRIER_SELECT,
    });
    if (answers.length === 0) continue;
    for (const field of BARRIER_FIELDS) {
      const { counts, otherCount, total } = tallyField(field, answers);
      acc[field].total += total * su.weight;
      acc[field].otherCount += otherCount * su.weight;
      for (const [key, count] of Object.entries(counts)) {
        acc[field].counts[key] =
          (acc[field].counts[key] ?? 0) + count * su.weight;
      }
    }
  }
  return acc;
};

const toChoiceResults = (
  field: BarrierField,
  tally: FieldTally,
): BarrierChoiceResult[] => [
  ...Object.entries(REASON_LABELS[field]).map(([key, meta]) => ({
    key,
    label: meta.label,
    emoji: meta.emoji,
    percentage:
      tally.total > 0
        ? round1(((tally.counts[key] ?? 0) / tally.total) * 100)
        : 0,
  })),
  {
    key: OTHER_KEY,
    label: OTHER_CHOICE_LABEL.label,
    emoji: OTHER_CHOICE_LABEL.emoji,
    percentage:
      tally.total > 0 ? round1((tally.otherCount / tally.total) * 100) : 0,
  },
];

const toFamilyResults = (
  tallies: Record<BarrierField, FieldTally>,
): BarrierChoiceResult[] => {
  const acc: Partial<Record<BarrierFamily, { count: number; total: number }>> =
    {};

  for (const field of BARRIER_FIELDS) {
    const tally = tallies[field];
    const perFamilyCount = new Map<BarrierFamily, number>();
    for (const [key, meta] of Object.entries(REASON_LABELS[field])) {
      perFamilyCount.set(
        meta.family,
        (perFamilyCount.get(meta.family) ?? 0) + (tally.counts[key] ?? 0),
      );
    }
    for (const [family, count] of perFamilyCount) {
      const entry = (acc[family] ??= { count: 0, total: 0 });
      entry.count += count;
      entry.total += tally.total;
    }

    const otherEntry = (acc["Autres raisons"] ??= { count: 0, total: 0 });
    otherEntry.count += tally.otherCount;
    otherEntry.total += tally.total;
  }

  return Object.entries(acc).map(([family, { count, total }]) => ({
    key: family,
    label: family,
    emoji: BARRIER_FAMILIES[family as BarrierFamily].emoji,
    percentage: total > 0 ? round1((count / total) * 100) : 0,
    isNotConcerned: family === "Non concerné",
  }));
};

export const getBarrierQuestion = async (
  surveyId: number,
  selectedSus: number[] | undefined,
  questionKey: BarrierField | "all",
): Promise<BarrierQuestionResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);
  const tallies = await getTallies(surveyId, isNeighborhood, suId);

  if (questionKey !== "all") {
    const tally = tallies[questionKey];
    return {
      field: questionKey,
      title: BARRIER_QUESTIONS[questionKey].title,
      emoji: BARRIER_QUESTIONS[questionKey].emoji,
      totalResponses: Math.round(tally.total),
      choices: toChoiceResults(questionKey, tally),
    };
  }

  return {
    field: "all",
    title: "Toutes les barrières",
    emoji: "🧩",
    totalResponses: Math.round(tallies[BARRIER_FIELDS[0]!].total),
    choices: toFamilyResults(tallies),
  };
};

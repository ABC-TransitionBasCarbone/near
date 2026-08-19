import { YesNo, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "~/server/db";
import {
  type SatisfactionSubcategory,
  SATISFACTION_SUBCATEGORIES,
} from "~/shared/services/dataviz/satisfaction";
import { toPercentage } from "~/shared/services/dataviz/percentage";
import { resolveSuId, getWeightedSus } from "~/server/su/dataviz/suSelection";

export type { SatisfactionSubcategory };

type SatisfactionField = Extract<
  keyof WayOfLifeAnswer,
  | "notColdHouse"
  | "confortHouseWhenHot"
  | "easyPublicTransports"
  | "easyWalking"
  | "easyBicycle"
  | "notTooMuchTraffic"
  | "carAnPedestriansRespect"
  | "easyToLeaveCityWithTranports"
  | "neighborhoodOrganicMarketSatisfaction"
  | "neighborhoodSeasonFruitAndVegetablesSatisfaction"
  | "neighborhoodOrganicProductsSatisfaction"
  | "privateOrShareFieldToFarm"
  | "accessToShortFoodCircuitSatisfaction"
  | "electronicRepairShopSatisfaction"
  | "clothesRepairShopSatisfaction"
  | "bicycleRepairShopSatisfaction"
  | "secondHandShopSatisfaction"
  | "localShopsToMeetYourNeeds"
  | "servicesToShareOrRentObjects"
  | "publicServicesPresence"
  | "associativeActivity"
  | "culturalActivity"
  | "hobbiesSpaces"
  | "neighborhoodLife"
  | "vegetalParksSatisfaction"
  | "noInformationOnCitizenParticipation"
  | "wantToParticipateToCivicInitiatives"
>;

const SUBCATEGORIES: Record<
  SatisfactionSubcategory,
  {
    label: string;
    emoji: string;
    questions: { field: SatisfactionField; title: string; emoji: string }[];
  }
> = {
  housing: {
    ...SATISFACTION_SUBCATEGORIES.housing,
    questions: [
      {
        field: "notColdHouse",
        title: "Isolation hiver",
        emoji: "❄️",
      },
      {
        field: "confortHouseWhenHot",
        title: "Confort du logement l'été",
        emoji: "☀️",
      },
    ],
  },
  mobility: {
    ...SATISFACTION_SUBCATEGORIES.mobility,
    questions: [
      {
        field: "easyPublicTransports",
        title: "Transports en commun",
        emoji: "🚌",
      },
      {
        field: "easyWalking",
        title: "Mobilité piétonne",
        emoji: "🚶",
      },
      {
        field: "easyBicycle",
        title: "Déplacement à vélo",
        emoji: "🚴",
      },
      {
        field: "notTooMuchTraffic",
        title: "Circulation",
        emoji: "🚦",
      },
      {
        field: "carAnPedestriansRespect",
        title: "Respect voiture/vélo/piéton",
        emoji: "🤝",
      },
      {
        field: "easyToLeaveCityWithTranports",
        title: "Faciliter à sortir de la ville",
        emoji: "🚉",
      },
    ],
  },
  food: {
    ...SATISFACTION_SUBCATEGORIES.food,
    questions: [
      {
        field: "neighborhoodOrganicMarketSatisfaction",
        title: "Offre alimentaire",
        emoji: "🥕",
      },
      {
        field: "neighborhoodSeasonFruitAndVegetablesSatisfaction",
        title: "Offre de fruits et légumes de saison",
        emoji: "🍎",
      },
      {
        field: "neighborhoodOrganicProductsSatisfaction",
        title: "Offre d'alimentation bio",
        emoji: "🌱",
      },
      {
        field: "privateOrShareFieldToFarm",
        title: "Jardins",
        emoji: "🌾",
      },
      {
        field: "accessToShortFoodCircuitSatisfaction",
        title: "Alimentation en circuits courts",
        emoji: "🧺",
      },
    ],
  },
  services: {
    ...SATISFACTION_SUBCATEGORIES.services,
    questions: [
      {
        field: "electronicRepairShopSatisfaction",
        title: "Réparation électronique et électroménager",
        emoji: "🔌",
      },
      {
        field: "clothesRepairShopSatisfaction",
        title: "Réparation de vêtements",
        emoji: "🧵",
      },
      {
        field: "bicycleRepairShopSatisfaction",
        title: "Réparation de vélo",
        emoji: "🚴",
      },
      {
        field: "secondHandShopSatisfaction",
        title: "Ressourceries et fripes",
        emoji: "♻️",
      },
      {
        field: "localShopsToMeetYourNeeds",
        title: "Commerces",
        emoji: "🏪",
      },
      {
        field: "servicesToShareOrRentObjects",
        title: "Location et partage d'objets",
        emoji: "🔄",
      },
      {
        field: "publicServicesPresence",
        title: "Services publics",
        emoji: "🏛️",
      },
    ],
  },
  nghLife: {
    ...SATISFACTION_SUBCATEGORIES.nghLife,
    questions: [
      {
        field: "culturalActivity",
        title: "Culture",
        emoji: "🎭",
      },
      {
        field: "hobbiesSpaces",
        title: "Sports et loisirs",
        emoji: "🎨",
      },
      {
        field: "neighborhoodLife",
        title: "Vie de quartier",
        emoji: "🏘️",
      },
      {
        field: "vegetalParksSatisfaction",
        title: "Espaces verts",
        emoji: "🌳",
      },
    ],
  },
  politics: {
    ...SATISFACTION_SUBCATEGORIES.politics,
    questions: [
      {
        field: "associativeActivity",
        title: "Vie associative",
        emoji: "🤝",
      },
      {
        field: "noInformationOnCitizenParticipation",
        title: "Manque d'information sur la participation citoyenne",
        emoji: "📢",
      },
      {
        field: "wantToParticipateToCivicInitiatives",
        title: "Volonté de participer aux initiatives citoyennes",
        emoji: "🗳️",
      },
    ],
  },
};

const YES_NO_LABELS: Record<YesNo, { label: string; emoji: string }> = {
  [YesNo.YES]: { label: "Oui", emoji: "✅" },
  [YesNo.NO]: { label: "Non", emoji: "❌" },
  [YesNo.DONT_KNOW]: { label: "Sans avis", emoji: "🤷" },
};

const SATISFACTION_SELECT = Object.fromEntries(
  Object.values(SUBCATEGORIES).flatMap((sub) =>
    sub.questions.map((q) => [q.field, true]),
  ),
) as Record<SatisfactionField, true>;

export type SatisfactionQuestionResult = {
  field: string;
  title: string;
  emoji: string;
  totalResponses: number;
  responses: {
    choice: YesNo;
    label: string;
    emoji: string;
    count: number;
    percentage: number;
  }[];
};

export type SatisfactionSubcategoryResult = {
  subcategory: SatisfactionSubcategory;
  label: string;
  emoji: string;
  questions: SatisfactionQuestionResult[];
};

export type SatisfactionDistributionResult = {
  subcategories: SatisfactionSubcategoryResult[];
  isNeighborhood: boolean;
};

type FieldCounts = Record<SatisfactionField, Record<YesNo, number>>;

const emptyFieldCounts = (): FieldCounts =>
  Object.fromEntries(
    Object.keys(SATISFACTION_SELECT).map((field) => [
      field,
      { YES: 0, NO: 0, DONT_KNOW: 0 },
    ]),
  ) as FieldCounts;

const countAnswers = (
  answers: Pick<WayOfLifeAnswer, SatisfactionField>[],
): FieldCounts => {
  const counts = emptyFieldCounts();
  for (const answer of answers) {
    for (const field of Object.keys(
      SATISFACTION_SELECT,
    ) as SatisfactionField[]) {
      counts[field][answer[field]]++;
    }
  }
  return counts;
};

const toResult = (
  counts: FieldCounts,
  subcategoryEntries: [
    SatisfactionSubcategory,
    (typeof SUBCATEGORIES)[SatisfactionSubcategory],
  ][],
  isNeighborhood: boolean,
): SatisfactionDistributionResult => ({
  isNeighborhood,
  subcategories: subcategoryEntries.map(([key, sub]) => ({
    subcategory: key,
    label: sub.label,
    emoji: sub.emoji,
    questions: sub.questions.map((q) => {
      const fieldCounts = counts[q.field];
      const totalResponses =
        fieldCounts.YES + fieldCounts.NO + fieldCounts.DONT_KNOW;
      return {
        field: q.field,
        title: q.title,
        emoji: q.emoji,
        totalResponses,
        responses: (Object.keys(YES_NO_LABELS) as YesNo[]).map((choice) => ({
          choice,
          ...YES_NO_LABELS[choice],
          count: fieldCounts[choice],
          percentage: toPercentage(fieldCounts[choice], totalResponses),
        })),
      };
    }),
  })),
});

export const getSatisfactionDistribution = async (
  surveyId: number,
  selectedSus?: number[],
  subcategory?: SatisfactionSubcategory,
): Promise<SatisfactionDistributionResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  const subcategoryEntries = (
    Object.entries(SUBCATEGORIES) as [
      SatisfactionSubcategory,
      (typeof SUBCATEGORIES)[SatisfactionSubcategory],
    ][]
  ).filter(([key]) => !subcategory || key === subcategory);

  if (!isNeighborhood) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId },
      select: SATISFACTION_SELECT,
    });
    return toResult(countAnswers(answers), subcategoryEntries, false);
  }

  const weightedSus = await getWeightedSus(surveyId);
  const weighted = emptyFieldCounts();

  for (const su of weightedSus) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId: su.id },
      select: SATISFACTION_SELECT,
    });
    if (answers.length === 0) continue;
    const suCounts = countAnswers(answers);
    for (const field of Object.keys(
      SATISFACTION_SELECT,
    ) as SatisfactionField[]) {
      for (const choice of Object.keys(YES_NO_LABELS) as YesNo[]) {
        weighted[field][choice] += suCounts[field][choice] * su.weight;
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
  ) as FieldCounts;

  return toResult(rounded, subcategoryEntries, true);
};

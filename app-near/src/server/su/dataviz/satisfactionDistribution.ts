import { YesNo, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "~/server/db";

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

export type SatisfactionSubcategory =
  "housing" | "mobility" | "food" | "services" | "nghLife" | "politics";

const SUBCATEGORIES: Record<
  SatisfactionSubcategory,
  {
    label: string;
    emoji: string;
    questions: { field: SatisfactionField; title: string; emoji: string }[];
  }
> = {
  housing: {
    label: "Logement",
    emoji: "🏠",
    questions: [
      {
        field: "notColdHouse",
        title: "Logement pas trop froid en hiver",
        emoji: "❄️",
      },
      {
        field: "confortHouseWhenHot",
        title: "Logement confortable en cas de forte chaleur",
        emoji: "☀️",
      },
    ],
  },
  mobility: {
    label: "Mobilité",
    emoji: "🚌",
    questions: [
      {
        field: "easyPublicTransports",
        title: "Transports en commun facilement accessibles",
        emoji: "🚌",
      },
      {
        field: "easyWalking",
        title: "Facile de se déplacer à pied",
        emoji: "🚶",
      },
      {
        field: "easyBicycle",
        title: "Facile de se déplacer à vélo",
        emoji: "🚲",
      },
      {
        field: "notTooMuchTraffic",
        title: "Pas trop de trafic routier",
        emoji: "🚗",
      },
      {
        field: "carAnPedestriansRespect",
        title: "Respect entre automobilistes et piétons",
        emoji: "🤝",
      },
      {
        field: "easyToLeaveCityWithTranports",
        title: "Facile de quitter le quartier en transports",
        emoji: "🚉",
      },
    ],
  },
  food: {
    label: "Alimentation",
    emoji: "🍽️",
    questions: [
      {
        field: "neighborhoodOrganicMarketSatisfaction",
        title: "Marché bio satisfaisant à proximité",
        emoji: "🥕",
      },
      {
        field: "neighborhoodSeasonFruitAndVegetablesSatisfaction",
        title: "Fruits et légumes de saison accessibles",
        emoji: "🍎",
      },
      {
        field: "neighborhoodOrganicProductsSatisfaction",
        title: "Produits bio accessibles",
        emoji: "🌱",
      },
      {
        field: "privateOrShareFieldToFarm",
        title: "Accès à un terrain privé ou partagé pour cultiver",
        emoji: "🌾",
      },
      {
        field: "accessToShortFoodCircuitSatisfaction",
        title: "Accès aux circuits courts alimentaires",
        emoji: "🧺",
      },
    ],
  },
  services: {
    label: "Services",
    emoji: "🏢",
    questions: [
      {
        field: "electronicRepairShopSatisfaction",
        title: "Réparateur d'électronique à proximité",
        emoji: "🔌",
      },
      {
        field: "clothesRepairShopSatisfaction",
        title: "Retoucherie / couturier à proximité",
        emoji: "🧵",
      },
      {
        field: "bicycleRepairShopSatisfaction",
        title: "Réparateur de vélo à proximité",
        emoji: "🚲",
      },
      {
        field: "secondHandShopSatisfaction",
        title: "Magasin de seconde main à proximité",
        emoji: "♻️",
      },
      {
        field: "localShopsToMeetYourNeeds",
        title: "Commerces de proximité suffisants",
        emoji: "🏪",
      },
      {
        field: "servicesToShareOrRentObjects",
        title: "Services de partage ou location d'objets",
        emoji: "🔄",
      },
      {
        field: "publicServicesPresence",
        title: "Présence de services publics",
        emoji: "🏛️",
      },
    ],
  },
  nghLife: {
    label: "Vie de quartier",
    emoji: "🏘️",
    questions: [
      {
        field: "associativeActivity",
        title: "Vie associative dynamique",
        emoji: "🤝",
      },
      {
        field: "culturalActivity",
        title: "Offre culturelle satisfaisante",
        emoji: "🎭",
      },
      {
        field: "hobbiesSpaces",
        title: "Espaces pour les loisirs",
        emoji: "🎨",
      },
      {
        field: "neighborhoodLife",
        title: "Bonne ambiance de quartier",
        emoji: "🏘️",
      },
      {
        field: "vegetalParksSatisfaction",
        title: "Espaces verts satisfaisants",
        emoji: "🌳",
      },
    ],
  },
  politics: {
    label: "Politique",
    emoji: "🏛️",
    questions: [
      {
        field: "noInformationOnCitizenParticipation",
        title: "Manque d'information sur la participation citoyenne",
        emoji: "📢",
      },
      {
        field: "wantToParticipateToCivicInitiatives",
        title: "Envie de participer aux initiatives citoyennes",
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

const toPercentage = (count: number, total: number) =>
  total > 0 ? Math.round((count / total) * 1000) / 10 : 0;

export const getSatisfactionDistribution = async (
  surveyId: number,
  selectedSus?: number[],
  subcategory?: SatisfactionSubcategory,
): Promise<SatisfactionDistributionResult> => {
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
    select: SATISFACTION_SELECT,
  });

  const subcategoryEntries = (
    Object.entries(SUBCATEGORIES) as [
      SatisfactionSubcategory,
      (typeof SUBCATEGORIES)[SatisfactionSubcategory],
    ][]
  ).filter(([key]) => !subcategory || key === subcategory);

  return {
    isNeighborhood,
    subcategories: subcategoryEntries.map(([key, sub]) => ({
      subcategory: key,
      label: sub.label,
      emoji: sub.emoji,
      questions: sub.questions.map((q) => {
        const counts: Record<YesNo, number> = { YES: 0, NO: 0, DONT_KNOW: 0 };
        for (const answer of answers) {
          counts[answer[q.field]]++;
        }
        const totalResponses = counts.YES + counts.NO + counts.DONT_KNOW;
        return {
          field: q.field,
          title: q.title,
          emoji: q.emoji,
          totalResponses,
          responses: (Object.keys(YES_NO_LABELS) as YesNo[]).map((choice) => ({
            choice,
            ...YES_NO_LABELS[choice],
            count: counts[choice],
            percentage: toPercentage(counts[choice], totalResponses),
          })),
        };
      }),
    })),
  };
};

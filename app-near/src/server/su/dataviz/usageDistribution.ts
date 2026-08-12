import { db } from "~/server/db";

export type UsageField =
  | "meatFrequency"
  | "transportationMode"
  | "digitalIntensity"
  | "purchasingStrategy"
  | "airTravelFrequency"
  | "heatSource";

export const USAGE_QUESTIONS: Record<
  UsageField,
  { title: string; emoji: string }
> = {
  meatFrequency: { title: "Consommation de viande", emoji: "🥩" },
  transportationMode: { title: "Mode de transport", emoji: "🚗" },
  digitalIntensity: { title: "Intensité numérique", emoji: "📱" },
  purchasingStrategy: { title: "Stratégie d'achat", emoji: "🛍️" },
  airTravelFrequency: { title: "Fréquence de voyage aérien", emoji: "✈️" },
  heatSource: { title: "Source de chauffage", emoji: "🔥" },
};

const USAGE_LABELS: Record<
  UsageField,
  Record<string, { label: string; emoji: string }>
> = {
  meatFrequency: {
    MINOR: { label: "Peu ou pas de viande", emoji: "🥦" },
    REGULAR: { label: "Viande occasionnelle", emoji: "🍗" },
    MAJOR: { label: "Viande à chaque repas", emoji: "🥩" },
  },
  transportationMode: {
    CAR: { label: "Voiture", emoji: "🚗" },
    PUBLIC: { label: "Transports en commun", emoji: "🚌" },
    LIGHT: { label: "Mobilités douces", emoji: "🚲" },
  },
  digitalIntensity: {
    LIGHT: { label: "Usage numérique léger", emoji: "📵" },
    REGULAR: { label: "Usage numérique régulier", emoji: "📱" },
    INTENSE: { label: "Usage numérique intense", emoji: "💻" },
  },
  purchasingStrategy: {
    NEW: { label: "Achats neufs", emoji: "🛍️" },
    MIXED: { label: "Achats mixtes", emoji: "🔄" },
    SECOND_HAND: { label: "Achats de seconde main", emoji: "♻️" },
  },
  airTravelFrequency: {
    ZERO: { label: "Aucun vol", emoji: "🚫" },
    FROM_1_TO_3: { label: "1 à 3 vols par an", emoji: "✈️" },
    ABOVE_3: { label: "Plus de 3 vols par an", emoji: "🛫" },
  },
  heatSource: {
    ELECTRICITY: { label: "Électricité", emoji: "🔌" },
    GAZ: { label: "Gaz", emoji: "🔥" },
    OIL: { label: "Fioul", emoji: "🛢️" },
  },
};

export type UsageDistributionResult = {
  data: {
    value: string;
    label: string;
    emoji: string;
    count: number;
    percentage: number;
  }[];
  isNeighborhood: boolean;
  totalResponses: number;
};

const toPercentage = (count: number, total: number) =>
  total > 0 ? Math.round((count / total) * 1000) / 10 : 0;

// Usage questions have no INSEE equivalent: the neighborhood view is simply the
// aggregate over every SuAnswer of the survey, unfiltered by suId.
export const getUsageDistribution = async (
  surveyId: number,
  field: UsageField,
  selectedSus?: number[],
): Promise<UsageDistributionResult> => {
  const isNeighborhood = selectedSus?.length !== 1;

  let suId: number | undefined;
  if (!isNeighborhood) {
    const su = await db.suData.findFirst({
      where: { surveyId, su: selectedSus[0] },
      select: { id: true },
    });
    suId = su?.id;
  }

  const counts = await db.suAnswer.groupBy({
    by: [field],
    where: isNeighborhood ? { surveyId } : { surveyId, suId },
    _count: true,
  });

  const totalResponses = counts.reduce((sum, c) => sum + c._count, 0);
  const labels = USAGE_LABELS[field];

  return {
    isNeighborhood,
    totalResponses,
    data: counts.map((c) => {
      const value = String(c[field]);
      return {
        value,
        ...(labels[value] ?? { label: value, emoji: "" }),
        count: c._count,
        percentage: toPercentage(c._count, totalResponses),
      };
    }),
  };
};

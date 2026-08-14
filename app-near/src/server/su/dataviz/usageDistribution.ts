import {
  type SuAnswer,
  MeatFrequency,
  TransportationMode,
  DigitalIntensity,
  PurchasingStrategy,
  AirTravelFrequency,
  HeatSource,
} from "@prisma/client";
import { db } from "~/server/db";

export type UsageField = Extract<
  keyof SuAnswer,
  | "meatFrequency"
  | "transportationMode"
  | "digitalIntensity"
  | "purchasingStrategy"
  | "airTravelFrequency"
  | "heatSource"
>;

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

type UsageLabel = { label: string; emoji: string };

const MEAT_FREQUENCY_LABELS: Record<MeatFrequency, UsageLabel> = {
  [MeatFrequency.MINOR]: { label: "Peu ou pas de viande", emoji: "🥦" },
  [MeatFrequency.REGULAR]: { label: "Viande occasionnelle", emoji: "🍗" },
  [MeatFrequency.MAJOR]: { label: "Viande à chaque repas", emoji: "🥩" },
};

const TRANSPORTATION_MODE_LABELS: Record<TransportationMode, UsageLabel> = {
  [TransportationMode.CAR]: { label: "Voiture", emoji: "🚗" },
  [TransportationMode.PUBLIC]: { label: "Transports en commun", emoji: "🚌" },
  [TransportationMode.LIGHT]: { label: "Mobilités douces", emoji: "🚲" },
};

const DIGITAL_INTENSITY_LABELS: Record<DigitalIntensity, UsageLabel> = {
  [DigitalIntensity.LIGHT]: { label: "Usage numérique léger", emoji: "📵" },
  [DigitalIntensity.REGULAR]: {
    label: "Usage numérique régulier",
    emoji: "📱",
  },
  [DigitalIntensity.INTENSE]: { label: "Usage numérique intense", emoji: "💻" },
};

const PURCHASING_STRATEGY_LABELS: Record<PurchasingStrategy, UsageLabel> = {
  [PurchasingStrategy.NEW]: { label: "Achats neufs", emoji: "🛍️" },
  [PurchasingStrategy.MIXED]: { label: "Achats mixtes", emoji: "🔄" },
  [PurchasingStrategy.SECOND_HAND]: {
    label: "Achats de seconde main",
    emoji: "♻️",
  },
};

const AIR_TRAVEL_FREQUENCY_LABELS: Record<AirTravelFrequency, UsageLabel> = {
  [AirTravelFrequency.ZERO]: { label: "Aucun vol", emoji: "🚫" },
  [AirTravelFrequency.FROM_1_TO_3]: {
    label: "1 à 3 vols par an",
    emoji: "✈️",
  },
  [AirTravelFrequency.ABOVE_3]: { label: "Plus de 3 vols par an", emoji: "🛫" },
};

const HEAT_SOURCE_LABELS: Record<HeatSource, UsageLabel> = {
  [HeatSource.ELECTRICITY]: { label: "Électricité", emoji: "🔌" },
  [HeatSource.GAZ]: { label: "Gaz", emoji: "🔥" },
  [HeatSource.OIL]: { label: "Fioul", emoji: "🛢️" },
};

const USAGE_LABELS: Record<UsageField, Record<string, UsageLabel>> = {
  meatFrequency: MEAT_FREQUENCY_LABELS,
  transportationMode: TRANSPORTATION_MODE_LABELS,
  digitalIntensity: DIGITAL_INTENSITY_LABELS,
  purchasingStrategy: PURCHASING_STRATEGY_LABELS,
  airTravelFrequency: AIR_TRAVEL_FREQUENCY_LABELS,
  heatSource: HEAT_SOURCE_LABELS,
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

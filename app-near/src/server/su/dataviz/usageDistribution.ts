import {
  MeatFrequency,
  TransportationMode,
  DigitalIntensity,
  PurchasingStrategy,
  AirTravelFrequency,
  HeatSource,
} from "@prisma/client";
import { db } from "~/server/db";
import {
  type UsageField,
  USAGE_QUESTIONS,
} from "~/shared/services/dataviz/usage";
import { toPercentage } from "~/shared/services/dataviz/percentage";
import { resolveSuId } from "~/server/su/dataviz/suSelection";

export type { UsageField };
export { USAGE_QUESTIONS };

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

export const getUsageDistribution = async (
  surveyId: number,
  field: UsageField,
  selectedSus?: number[],
): Promise<UsageDistributionResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  const counts = await db.suAnswer.groupBy({
    by: [field],
    where: isNeighborhood ? { surveyId } : { surveyId, suId },
    _count: true,
  });

  const totalResponses = counts.reduce((sum, c) => sum + c._count, 0);
  const labels = USAGE_LABELS[field];
  const countByValue = new Map(counts.map((c) => [String(c[field]), c._count]));

  return {
    isNeighborhood,
    totalResponses,
    data: Object.entries(labels).map(([value, label]) => {
      const count = countByValue.get(value) ?? 0;
      return {
        value,
        ...label,
        count,
        percentage: toPercentage(count, totalResponses),
      };
    }),
  };
};

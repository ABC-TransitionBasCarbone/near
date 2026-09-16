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

type UsageLabel = { label: string; shortLabel: string; emoji: string };

const MEAT_FREQUENCY_LABELS: Record<MeatFrequency, UsageLabel> = {
  [MeatFrequency.MINOR]: {
    label: "0 à 4 repas de viande par semaine",
    shortLabel: "0-4",
    emoji: "🥦",
  },
  [MeatFrequency.REGULAR]: {
    label: "4 à 9 repas de viande par semaine",
    shortLabel: "4-9",
    emoji: "🍗",
  },
  [MeatFrequency.MAJOR]: {
    label: "10 repas de viande ou plus par semaine",
    shortLabel: "≥ 10",
    emoji: "🥩",
  },
};

const TRANSPORTATION_MODE_LABELS: Record<TransportationMode, UsageLabel> = {
  [TransportationMode.LIGHT]: {
    label: "Marche, vélo...",
    shortLabel: "Marche, vélo...",
    emoji: "🚲",
  },
  [TransportationMode.PUBLIC]: {
    label: "Transports en commun",
    shortLabel: "Transp. en commun",
    emoji: "🚌",
  },
  [TransportationMode.CAR]: {
    label: "Voiture",
    shortLabel: "Voiture",
    emoji: "🚗",
  },
};

const DIGITAL_INTENSITY_LABELS: Record<DigitalIntensity, UsageLabel> = {
  [DigitalIntensity.LIGHT]: {
    label: "Moins de 2h d'écran par jour",
    shortLabel: "< 2h",
    emoji: "📵",
  },
  [DigitalIntensity.REGULAR]: {
    label: "2 à 4h d'écran par jour",
    shortLabel: "2-4h",
    emoji: "📱",
  },
  [DigitalIntensity.INTENSE]: {
    label: "Plus de 4h d'écran par jour",
    shortLabel: "> 4h",
    emoji: "💻",
  },
};

const PURCHASING_STRATEGY_LABELS: Record<PurchasingStrategy, UsageLabel> = {
  [PurchasingStrategy.SECOND_HAND]: {
    label: "Occasion",
    shortLabel: "Occasion",
    emoji: "♻️",
  },
  [PurchasingStrategy.MIXED]: {
    label: "Mixte",
    shortLabel: "Mixte",
    emoji: "🔄",
  },
  [PurchasingStrategy.NEW]: {
    label: "Neuf",
    shortLabel: "Neuf",
    emoji: "🛍️",
  },
};

const AIR_TRAVEL_FREQUENCY_LABELS: Record<AirTravelFrequency, UsageLabel> = {
  [AirTravelFrequency.ZERO]: {
    label: "Moins d'1 vol par an",
    shortLabel: "< 1",
    emoji: "🚫",
  },
  [AirTravelFrequency.FROM_1_TO_3]: {
    label: "1 à 3 vols par an",
    shortLabel: "1-3",
    emoji: "✈️",
  },
  [AirTravelFrequency.ABOVE_3]: {
    label: "Plus de 3 vols par an",
    shortLabel: "> 3",
    emoji: "🛫",
  },
};

const HEAT_SOURCE_LABELS: Record<HeatSource, UsageLabel> = {
  [HeatSource.ELECTRICITY]: {
    label: "Élec, bois, réseau de chaleur",
    shortLabel: "Élec, bois...",
    emoji: "🔌",
  },
  [HeatSource.GAZ]: { label: "Gaz", shortLabel: "Gaz", emoji: "🔥" },
  [HeatSource.OIL]: { label: "Fioul", shortLabel: "Fioul", emoji: "🛢️" },
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
    shortLabel: string;
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

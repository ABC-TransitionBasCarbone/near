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

export const USAGE_FIELDS: UsageField[] = Object.keys(
  USAGE_QUESTIONS,
) as UsageField[];

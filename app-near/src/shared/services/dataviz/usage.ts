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
  meatFrequency: { title: "Repas avec viande / semaine", emoji: "🥩" },
  transportationMode: { title: "Mobilité quotidienne", emoji: "🚗" },
  digitalIntensity: { title: "Heures d'écrans / jour", emoji: "📱" },
  purchasingStrategy: { title: "Mode d'achat principal", emoji: "🛍️" },
  airTravelFrequency: { title: "Vols en avion / an", emoji: "✈️" },
  heatSource: { title: "Mode de chauffage", emoji: "🔥" },
};

export const USAGE_FIELDS: UsageField[] = Object.keys(
  USAGE_QUESTIONS,
) as UsageField[];

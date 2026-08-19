import { YesNo } from "@prisma/client";

export type SatisfactionSubcategory =
  "housing" | "mobility" | "food" | "services" | "nghLife" | "politics";

export const YES_NO_COLORS: Record<YesNo, string> = {
  [YesNo.NO]: "#ffcdd2",
  [YesNo.DONT_KNOW]: "#f5f5f5",
  [YesNo.YES]: "#c8e6c9",
};

export const SATISFACTION_SUBCATEGORIES: Record<
  SatisfactionSubcategory,
  { label: string; emoji: string }
> = {
  housing: { label: "Logement", emoji: "🏠" },
  mobility: { label: "Mobilité", emoji: "🚌" },
  food: { label: "Alimentation", emoji: "🍽️" },
  services: { label: "Services", emoji: "🏢" },
  nghLife: { label: "Vie de quartier", emoji: "🏘️" },
  politics: { label: "Politique", emoji: "🏛️" },
};

export const SATISFACTION_SUBCATEGORY_KEYS: SatisfactionSubcategory[] =
  Object.keys(SATISFACTION_SUBCATEGORIES) as SatisfactionSubcategory[];

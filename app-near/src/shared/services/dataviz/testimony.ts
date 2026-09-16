export type TestimonySubcategory =
  | "Food"
  | "Housing"
  | "Politics"
  | "Solidarity"
  | "NghLife"
  | "Parks"
  | "Shopping"
  | "Services"
  | "Mobility"
  | "General";

export const TESTIMONY_SUBCATEGORIES: Record<
  TestimonySubcategory,
  { label: string; emoji: string }
> = {
  Food: { label: "Alimentation", emoji: "🍝🗣️" },
  Housing: { label: "Logement", emoji: "🏘️🗣️" },
  Politics: { label: "Participation citoyenne", emoji: "🙋‍♂️🗣️" },
  Solidarity: { label: "Solidarité", emoji: "🧑‍🤝‍🧑🗣️" },
  NghLife: { label: "Vie de quartier", emoji: "🏙️🗣️" },
  Parks: { label: "Parcs et espaces verts", emoji: "🌳🗣️" },
  Shopping: { label: "Réparation / Shopping", emoji: "🔧🗣️" },
  Services: { label: "Services", emoji: "🏛️🗣️" },
  Mobility: { label: "Mobilité", emoji: "🚦🗣️" },
  General: { label: "Général", emoji: "🏙️💬" },
};

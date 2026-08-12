import React from "react";
import { type Board } from "~/types/Dataviz";
import type { SatisfactionSubcategory } from "~/server/su/dataviz/satisfactionDistribution";
import DvEmdvSatisfactionsByCategory from "../dataviz/DvEmdvSatisfactionsByCategory";

// Central list of EMDV subcategories we support as individual boards
const EMDV_SUBCATEGORIES: Array<{
  key: SatisfactionSubcategory;
  name: string;
  emoji: string;
}> = [
  { key: "food", name: "Alimentation", emoji: "🍽️" },
  { key: "politics", name: "Politique", emoji: "🏛️" },
  { key: "nghLife", name: "Vie de quartier", emoji: "🏘️" },
  { key: "services", name: "Services", emoji: "🏪" },
  { key: "mobility", name: "Mobilité", emoji: "🚌" },
  { key: "housing", name: "Logement", emoji: "🏠" },
];

export const EmdvByCategoryBoards: Board[] = EMDV_SUBCATEGORIES.map((cat) => ({
  id: `EMDV_${cat.key}`,
  name: `Avis sur ${cat.name}`,
  emoji: cat.emoji,
  description: `Satisfactions et insatisfactions pour la sous-catégorie « ${cat.name} »`,
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="other-board">
      <header className="board-header">
        <h2 className="board-title">
          {cat.emoji} Avis sur le cadre de vie - {cat.name}
        </h2>
        <p className="board-subtitle">
          Répartition entre 🟥 Avis négatifs, 🔲Pas d&apos;avis et 🟩 Avis
          positifs, pour différentes questions liées au thème {cat.name}.
        </p>
      </header>

      <div className="dv-container" style={{ height: 520 }}>
        <DvEmdvSatisfactionsByCategory
          selectedSus={selectedSus}
          category={cat.key}
        />
      </div>
    </div>
  ),
}));

export default EmdvByCategoryBoards;

import React from "react";
import { type Board } from "~/types/Dataviz";
import {
  SATISFACTION_SUBCATEGORIES,
  SATISFACTION_SUBCATEGORY_KEYS,
} from "~/shared/services/dataviz/satisfaction";
import DvEmdvSatisfactionsByCategory from "../dataviz/DvEmdvSatisfactionsByCategory";

export const EmdvByCategoryBoards: Board[] = SATISFACTION_SUBCATEGORY_KEYS.map(
  (key) => {
    const { label, emoji } = SATISFACTION_SUBCATEGORIES[key];
    return {
      id: `EMDV_${key}`,
      name: `Avis sur ${label}`,
      emoji,
      description: `Satisfactions et insatisfactions pour la sous-catégorie « ${label} »`,
      renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
        <div className="other-board flex h-full flex-col overflow-y-auto p-4">
          <header className="mb-4">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
              {emoji} Avis sur le cadre de vie - {label}
            </h2>
            <p className="mt-1 text-sm text-gray">
              Répartition entre 🟥 Avis négatifs, 🔲Pas d&apos;avis et 🟩 Avis
              positifs, pour différentes questions liées au thème {label}.
            </p>
          </header>

          <div
            className="dv-container rounded-lg border border-grayLight bg-white p-3"
            style={{ height: 520 }}
          >
            <DvEmdvSatisfactionsByCategory
              selectedSus={selectedSus}
              category={key}
            />
          </div>
        </div>
      ),
    };
  },
);

export default EmdvByCategoryBoards;

import React from "react";
import { type Board } from "~/types/Dataviz";
import {
  SATISFACTION_SUBCATEGORIES,
  SATISFACTION_SUBCATEGORY_KEYS,
} from "~/shared/services/dataviz/satisfaction";
import DvEmdvSatisfactionsByCategory from "../dataviz/DvEmdvSatisfactionsByCategory";
import BoardSection from "./BoardSection";

export const EmdvByCategoryBoards: Board[] = SATISFACTION_SUBCATEGORY_KEYS.map(
  (key) => {
    const { label, emoji } = SATISFACTION_SUBCATEGORIES[key];
    return {
      id: `EMDV_${key}`,
      name: `Avis sur ${label}`,
      emoji,
      description: `Satisfactions et insatisfactions pour la sous-catégorie « ${label} »`,
      renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
        <BoardSection
          title={
            <>
              <span aria-hidden="true">{emoji}</span> Avis sur le cadre de vie -{" "}
              {label}
            </>
          }
          description={
            <>
              Répartition entre <span aria-hidden="true">🟥</span> Avis
              négatifs, <span aria-hidden="true">🔲</span>Pas d&apos;avis et{" "}
              <span aria-hidden="true">🟩</span> Avis positifs, pour différentes
              questions liées au thème {label}.
            </>
          }
          containerStyle={{ height: 520 }}
        >
          <DvEmdvSatisfactionsByCategory
            selectedSus={selectedSus}
            category={key}
          />
        </BoardSection>
      ),
    };
  },
);

export default EmdvByCategoryBoards;

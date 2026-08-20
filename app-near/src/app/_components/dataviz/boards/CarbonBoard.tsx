import React from "react";
import DvCarbonStackedBars from "../dataviz/DvCarbonStackedBars";
import { type Board } from "~/types/Dataviz";
import BoardSection from "./BoardSection";

export const CarbonBoard: Board = {
  id: "CARBON_BARS",
  name: "Empreinte carbone — bilan",
  emoji: "🌍",
  description:
    "Bilan de l'empreinte carbone par grande catégorie (barres empilées)",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <BoardSection
      title={
        <>
          <span aria-hidden="true">🌍</span> Empreinte carbone — Bilan par
          catégorie
        </>
      }
      description="Empreinte moyenne par personne et par an, décomposée par sous-catégorie"
      containerStyle={{ height: "auto", overflow: "visible" }}
    >
      <DvCarbonStackedBars selectedSus={selectedSus} />
    </BoardSection>
  ),
};

export default CarbonBoard;

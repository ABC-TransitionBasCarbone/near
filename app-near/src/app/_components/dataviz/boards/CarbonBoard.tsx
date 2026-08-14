import React from "react";
import DvCarbonStackedBars from "../dataviz/DvCarbonStackedBars";
import { type Board } from "~/types/Dataviz";

export const CarbonBoard: Board = {
  id: "CARBON_BARS",
  name: "Empreinte carbone — bilan",
  emoji: "🌍",
  description:
    "Bilan de l'empreinte carbone par grande catégorie (barres empilées)",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="other-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          🌍 Empreinte carbone — Bilan par catégorie
        </h2>
        <p className="mt-1 text-sm text-gray">
          Empreinte moyenne par personne et par an, décomposée par
          sous-catégorie
        </p>
      </header>
      <div
        className="dv-container rounded-lg border border-grayLight bg-white p-3"
        style={{ height: "auto", overflow: "visible" }}
      >
        <DvCarbonStackedBars selectedSus={selectedSus} />
      </div>
    </div>
  ),
};

export default CarbonBoard;

import React from "react";
import DvEmdvSatisfactionsPieCharts from "../dataviz/DvEmdvSatisfactionsPieCharts";
import { type Board } from "~/types/Dataviz";

export const EmdvPieChartsBoard: Board = {
  id: "EMDV_PIE_ALL",
  name: "Avis sur le Cadre de vie",
  emoji: "👍",
  description:
    "Vue d'ensemble des avis sur le cadre de vie (format camemberts)",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="other-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          👍 Les avis sur le cadre de vie
        </h2>
        <p className="mt-1 text-sm text-gray">
          Répartition des avis par question — 🟥 Avis négatifs · ⬜ Pas
          d&apos;avis · 🟩 Avis positifs
        </p>
      </header>
      <div
        className="dv-container rounded-lg border border-grayLight bg-white p-3"
        style={{ height: "auto", minHeight: "unset", overflow: "visible" }}
      >
        <DvEmdvSatisfactionsPieCharts selectedSus={selectedSus} />
      </div>
    </div>
  ),
};

export default EmdvPieChartsBoard;

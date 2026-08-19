import React from "react";
import DvEmdvSatisfactionsPieCharts from "../dataviz/DvEmdvSatisfactionsPieCharts";
import { type Board } from "~/types/Dataviz";
import BoardSection from "./BoardSection";

export const EmdvPieChartsBoard: Board = {
  id: "EMDV_PIE_ALL",
  name: "Avis sur le Cadre de vie",
  emoji: "👍",
  description:
    "Vue d'ensemble des avis sur le cadre de vie (format camemberts)",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <BoardSection
      title="👍 Les avis sur le cadre de vie"
      description={
        <>
          Répartition des avis par question — 🟥 Avis négatifs · ⬜ Pas
          d&apos;avis · 🟩 Avis positifs
        </>
      }
      containerStyle={{
        height: "auto",
        minHeight: "unset",
        overflow: "visible",
      }}
    >
      <DvEmdvSatisfactionsPieCharts selectedSus={selectedSus} />
    </BoardSection>
  ),
};

export default EmdvPieChartsBoard;

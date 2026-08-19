import React from "react";
import { type Board } from "~/types/Dataviz";
import DvBarrierAggregated from "../dataviz/DvBarrierAggregated";
import BoardSection from "./BoardSection";

export const BarrierBoards: Board[] = [
  {
    id: "BARRIERS_AGG",
    name: "Barrières à la transition",
    emoji: "🚧",
    description: "Les barrières pour différents usages, agrégées ensembles",
    renderComponent: ({ selectedSus }) => (
      <BoardSection
        title="🚧 Barrières à la transition"
        description="% de répondants ayant coché une réponse dans chaque famille de barrière"
        containerStyle={{ height: 420 }}
      >
        <DvBarrierAggregated selectedSus={selectedSus} />
      </BoardSection>
    ),
  },
];

export default BarrierBoards;

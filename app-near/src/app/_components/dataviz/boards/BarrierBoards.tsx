import React from "react";
import { type Board } from "~/types/Dataviz";
import DvBarrierAggregated from "../dataviz/DvBarrierAggregated";

export const BarrierBoards: Board[] = [
  {
    id: "BARRIERS_AGG",
    name: "Barrières à la transition",
    emoji: "🚧",
    description: "Les barrières pour différents usages, agrégées ensembles",
    renderComponent: ({ selectedSus }) => (
      <div className="other-board">
        <header className="board-header">
          <h2 className="board-title">🚧 Barrières à la transition</h2>
          <p className="board-subtitle">
            % de répondants ayant coché une réponse dans chaque famille de
            barrière
          </p>
        </header>
        <div className="dv-container" style={{ height: 420 }}>
          <DvBarrierAggregated selectedSus={selectedSus} />
        </div>
      </div>
    ),
  },
];

export default BarrierBoards;

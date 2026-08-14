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
      <div className="other-board flex h-full flex-col overflow-y-auto p-4">
        <header className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
            🚧 Barrières à la transition
          </h2>
          <p className="mt-1 text-sm text-gray">
            % de répondants ayant coché une réponse dans chaque famille de
            barrière
          </p>
        </header>
        <div
          className="dv-container rounded-lg border border-grayLight bg-white p-3"
          style={{ height: 420 }}
        >
          <DvBarrierAggregated selectedSus={selectedSus} />
        </div>
      </div>
    ),
  },
];

export default BarrierBoards;

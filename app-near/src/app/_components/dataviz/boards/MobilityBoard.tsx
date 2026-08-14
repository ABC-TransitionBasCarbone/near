import React from "react";
import { type Board } from "~/types/Dataviz";
import DvMobility from "../dataviz/DvMobility";

export const MobilityBoard: Board = {
  id: "Mobility",
  name: "Mobilité",
  emoji: "🚲",
  description: "Visualisation de la mobilité des répondants.",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="other-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          {MobilityBoard.emoji} {MobilityBoard.name}
        </h2>
        <p className="mt-1 text-sm text-gray">{MobilityBoard.description}</p>
      </header>
      <div
        className="dv-container rounded-lg border border-grayLight bg-white p-3"
        style={{ height: 800 }}
      >
        <DvMobility selectedSus={selectedSus} />
      </div>
    </div>
  ),
};

export default MobilityBoard;

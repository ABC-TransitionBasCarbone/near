import React from "react";
import { type Board } from "~/types/Dataviz";
import DvVolonteTout from "../dataviz/DvVolonteTout";

export const VolonteBoard: Board = {
  id: "VolonteTout",
  name: "Volontés de changement",
  emoji: "🎯",
  description:
    "Quelles sont les volontés de changement exprimées pour 4 usages clés ?",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="other-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          {VolonteBoard.emoji} {VolonteBoard.name}
        </h2>
        <p className="mt-1 text-sm text-gray">{VolonteBoard.description}</p>
      </header>
      <div
        className="dv-container rounded-lg border border-grayLight bg-white p-3"
        style={{ height: 520 }}
      >
        <DvVolonteTout selectedSus={selectedSus} />
      </div>
    </div>
  ),
};

export default VolonteBoard;

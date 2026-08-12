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
    <div className="other-board">
      <header className="board-header">
        <h2 className="board-title">
          {VolonteBoard.emoji} {VolonteBoard.name}
        </h2>
        <p className="board-subtitle">{VolonteBoard.description}</p>
      </header>
      <div style={{ height: 520 }}>
        <DvVolonteTout selectedSus={selectedSus} />
      </div>
    </div>
  ),
};

export default VolonteBoard;

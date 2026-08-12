// Testimony Board - Network graph visualization for testimony network analysis

import { type Board } from "~/types/Dataviz";
import DvTestimonyNetwork from "../dataviz/DvTestimonyNetwork";

export const TestimonyBoard: Board = {
  id: "Testimony",
  name: "Carte des Témoignages",
  emoji: "💬",
  description:
    "Découvrez une carte mentale des témoignages recueillis pendant l'enquête.",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="demographie-board">
      <header className="board-header">
        <h2 className="board-title">
          {TestimonyBoard.emoji} {TestimonyBoard.name}
        </h2>
        <p className="board-subtitle">{TestimonyBoard.description}</p>
      </header>

      <div className="board-content" style={{ height: "calc(100% - 120px)" }}>
        <div className="dv-container" style={{ height: "100%", width: "100%" }}>
          <DvTestimonyNetwork selectedSus={selectedSus} />
        </div>
      </div>
    </div>
  ),
};

export default TestimonyBoard;

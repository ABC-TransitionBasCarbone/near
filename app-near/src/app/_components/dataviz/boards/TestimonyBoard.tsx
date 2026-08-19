import { type Board } from "~/types/Dataviz";
import DvTestimonyNetwork from "../dataviz/DvTestimonyNetwork";

export const TestimonyBoard: Board = {
  id: "Testimony",
  name: "Carte des Témoignages",
  emoji: "💬",
  description:
    "Découvrez une carte mentale des témoignages recueillis pendant l'enquête.",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="demographie-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          {TestimonyBoard.emoji} {TestimonyBoard.name}
        </h2>
        <p className="mt-1 text-sm text-gray">{TestimonyBoard.description}</p>
      </header>

      <div className="board-content" style={{ height: "calc(100% - 120px)" }}>
        <div
          className="dv-container rounded-lg border border-grayLight bg-white p-3"
          style={{ height: "100%", width: "100%" }}
        >
          <DvTestimonyNetwork selectedSus={selectedSus} />
        </div>
      </div>
    </div>
  ),
};

export default TestimonyBoard;

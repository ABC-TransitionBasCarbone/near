import React from "react";
import { type Board } from "~/types/Dataviz";
import DvMobility from "../dataviz/DvMobility";
import BoardSection from "./BoardSection";

export const MobilityBoard: Board = {
  id: "Mobility",
  name: "Mobilité",
  emoji: "🚴",
  description: "Visualisation de la mobilité des répondants.",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <BoardSection
      title={
        <>
          <span aria-hidden="true">{MobilityBoard.emoji}</span>{" "}
          {MobilityBoard.name}
        </>
      }
      description={MobilityBoard.description}
      containerStyle={{ height: 800 }}
    >
      <DvMobility selectedSus={selectedSus} />
    </BoardSection>
  ),
};

export default MobilityBoard;

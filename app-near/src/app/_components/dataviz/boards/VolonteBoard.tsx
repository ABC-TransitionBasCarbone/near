import React from "react";
import { type Board } from "~/types/Dataviz";
import DvVolonteTout from "../dataviz/DvVolonteTout";
import BoardSection from "./BoardSection";

export const VolonteBoard: Board = {
  id: "VolonteTout",
  name: "Volontés de changement",
  emoji: "🎯",
  description:
    "Quelles sont les volontés de changement exprimées pour 4 usages clés ?",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <BoardSection
      title={
        <>
          <span aria-hidden="true">{VolonteBoard.emoji}</span>{" "}
          {VolonteBoard.name}
        </>
      }
      description={VolonteBoard.description}
      containerStyle={{ height: 520 }}
    >
      <DvVolonteTout selectedSus={selectedSus} />
    </BoardSection>
  ),
};

export default VolonteBoard;

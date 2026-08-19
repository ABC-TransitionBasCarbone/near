import React from "react";
import DvBarrierGradient from "../dataviz/DvBarrierGradient";
import {
  BARRIER_FIELDS,
  BARRIER_QUESTIONS,
} from "~/shared/services/dataviz/barriers";
import { type Board } from "~/types/Dataviz";
import BoardSection from "./BoardSection";

export const BarrierQuestionBoards: Board[] = BARRIER_FIELDS.map((key) => {
  const { title, emoji } = BARRIER_QUESTIONS[key];
  const id = `BARRIERS_Q_${key}`;
  return {
    id,
    name: title,
    emoji,
    description: `% des répondants ayant indiqué des barrières à la transition`,
    renderComponent: ({ selectedSus }) => (
      <BoardSection
        title={`${emoji} Barrières ${title}`}
        description="% de répondants ayant coché les différentes réponses"
        containerStyle={{ height: 460 }}
      >
        <DvBarrierGradient
          selectedSus={selectedSus}
          selectedQuestionKey={key}
        />
      </BoardSection>
    ),
  };
});

export default BarrierQuestionBoards;

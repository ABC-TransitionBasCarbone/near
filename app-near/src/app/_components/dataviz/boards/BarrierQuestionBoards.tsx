import React from "react";
import DvBarrierGradient from "../dataviz/DvBarrierGradient";
import {
  BARRIER_FIELDS,
  BARRIER_QUESTIONS,
} from "~/shared/services/dataviz/barriers";
import { type Board } from "~/types/Dataviz";

export const BarrierQuestionBoards: Board[] = BARRIER_FIELDS.map((key) => {
  const { title, emoji } = BARRIER_QUESTIONS[key];
  const id = `BARRIERS_Q_${key}`;
  return {
    id,
    name: title,
    emoji,
    description: `% des répondants ayant indiqué des barrières à la transition`,
    renderComponent: ({ selectedSus }) => (
      <div className="other-board flex h-full flex-col overflow-y-auto p-4">
        <header className="mb-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
            {emoji} Barrières {title}
          </h2>
          <p className="mt-1 text-sm text-gray">
            % de répondants ayant coché les différentes réponses
          </p>
        </header>
        <div
          className="dv-container rounded-lg border border-grayLight bg-white p-3"
          style={{ height: 460 }}
        >
          <DvBarrierGradient
            selectedSus={selectedSus}
            selectedQuestionKey={key}
          />
        </div>
      </div>
    ),
  };
});

export default BarrierQuestionBoards;

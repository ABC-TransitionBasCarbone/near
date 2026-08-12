import React from "react";
import DvBarrierGradient from "../dataviz/DvBarrierGradient";
import type { BarrierField } from "~/server/su/dataviz/barriers";
import { type Board } from "~/types/Dataviz";

// Kept in sync with BARRIER_QUESTIONS in server/su/dataviz/barriers.ts — duplicated
// here (rather than imported) so this client-bundled file never pulls in ~/server/db.
const BARRIER_QUESTIONS: Record<
  BarrierField,
  { title: string; emoji: string }
> = {
  reasonsToContinueUsingCar: {
    title: "Pourquoi continuez-vous à utiliser la voiture ?",
    emoji: "🚗",
  },
  reasonsToEatMeat: {
    title: "Pourquoi continuez-vous à manger de la viande ?",
    emoji: "🥩",
  },
  reasonsToNotBuyFrenchAndSeasonFood: {
    title: "Pourquoi n'achetez-vous pas plus local et de saison ?",
    emoji: "🥕",
  },
  reasonsToNotChoseSecondHand: {
    title: "Pourquoi ne choisissez-vous pas la seconde main ?",
    emoji: "♻️",
  },
};

const BARRIER_FIELDS = Object.keys(BARRIER_QUESTIONS) as BarrierField[];

export const BarrierQuestionBoards: Board[] = BARRIER_FIELDS.map((key) => {
  const { title, emoji } = BARRIER_QUESTIONS[key];
  const id = `BARRIERS_Q_${key}`;
  return {
    id,
    name: title,
    emoji,
    description: `% des répondants ayant indiqué des barrières à la transition`,
    renderComponent: ({ selectedSus }) => (
      <div className="other-board">
        <header className="board-header">
          <h2 className="board-title">
            {emoji} Barrières {title}
          </h2>
          <p className="board-subtitle">
            % de répondants ayant coché les différentes réponses
          </p>
        </header>
        <div className="dv-container" style={{ height: 460 }}>
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

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

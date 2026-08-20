"use client";

import React from "react";
import { BOARD_GROUPS } from "./boards/registry";

type BoardTabsProps = {
  selectedBoard: string;
  onBoardChange: (boardId: string) => void;
};

const BoardTabs: React.FC<BoardTabsProps> = ({
  selectedBoard,
  onBoardChange,
}) => {
  const activeGroup =
    BOARD_GROUPS.find(
      (group) =>
        group.main.id === selectedBoard ||
        group.subBoards?.some((board) => board.id === selectedBoard),
    ) ?? BOARD_GROUPS[0];

  return (
    <div className="border-b border-grayLight bg-white px-4 py-5">
      <h3 className="mb-2 text-sm font-semibold text-black">
        <span aria-hidden="true">📊</span> Que voulez-vous découvrir ?
      </h3>
      <div className="flex flex-wrap gap-2">
        {BOARD_GROUPS.map((group) => (
          <button
            key={group.main.id}
            onClick={() => onBoardChange(group.main.id)}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
              activeGroup?.main.id === group.main.id
                ? "border-blue bg-blue text-white"
                : "border-grayLight text-blue hover:bg-blue/5"
            }`}
          >
            <span aria-hidden="true">{group.main.emoji}</span> {group.main.name}
          </button>
        ))}
      </div>

      {activeGroup?.subBoards && activeGroup.subBoards.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2 border-t border-grayLight pt-2">
          <button
            onClick={() => onBoardChange(activeGroup.main.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selectedBoard === activeGroup.main.id
                ? "border-blue bg-blue text-white"
                : "border-grayLight text-gray hover:bg-blue/5"
            }`}
          >
            <span aria-hidden="true">{activeGroup.main.emoji}</span> Vue
            d&apos;ensemble
          </button>
          {activeGroup.subBoards.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                selectedBoard === board.id
                  ? "border-blue bg-blue text-white"
                  : "border-grayLight text-gray hover:bg-blue/5"
              }`}
            >
              <span aria-hidden="true">{board.emoji}</span> {board.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardTabs;

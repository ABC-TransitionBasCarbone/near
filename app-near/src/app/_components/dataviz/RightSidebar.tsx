"use client";

import React from "react";
import { BOARD_REGISTRY } from "./boards/registry";

type RightSidebarProps = {
  selectedBoard: string;
  onBoardChange: (boardId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

const RightSidebar: React.FC<RightSidebarProps> = ({
  selectedBoard,
  onBoardChange,
  isCollapsed,
  onToggleCollapse,
}) => {
  return (
    <div className="relative flex h-full flex-col border-l border-grayLight bg-white">
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
        className="absolute -left-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-grayLight bg-white text-xs text-gray hover:bg-grayExtraLight"
      >
        {isCollapsed ? "‹" : "›"}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center gap-3 overflow-y-auto py-4">
          {BOARD_REGISTRY.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              title={board.name}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-lg ${
                board.id === selectedBoard
                  ? "bg-blue text-white"
                  : "hover:bg-blue/10"
              }`}
            >
              {board.emoji}
            </button>
          ))}
        </div>
      ) : (
        <div className="overflow-y-auto px-4 pb-4 pt-10">
          <h3 className="mb-3 text-base font-semibold text-black">
            📊 Que voulez-vous découvrir ?
          </h3>
          <div className="flex flex-col gap-2">
            {BOARD_REGISTRY.map((board) => (
              <button
                key={board.id}
                onClick={() => onBoardChange(board.id)}
                className={`w-full rounded-md border p-3 text-left text-sm transition ${
                  board.id === selectedBoard
                    ? "border-blue bg-blue text-white"
                    : "border-grayLight bg-white text-blue hover:bg-blue/5"
                }`}
              >
                <div className="mb-1 font-semibold">
                  {board.emoji} {board.name}
                </div>
                <div className="text-xs leading-tight">{board.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;

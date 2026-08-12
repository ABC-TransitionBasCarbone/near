"use client";

import { BOARD_REGISTRY } from "./boards/registry";

type RightSidebarProps = {
  selectedBoard: string;
  onBoardChange: (boardId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export default function RightSidebar({
  selectedBoard,
  onBoardChange,
  isCollapsed,
  onToggleCollapse,
}: RightSidebarProps) {
  return (
    <div className="sidebar-base sidebar-right">
      <div
        className="collapse-trigger right"
        onClick={onToggleCollapse}
        title={isCollapsed ? "Étendre la sidebar" : "Réduire la sidebar"}
      />

      <div
        className={`sidebar-content ${isCollapsed ? "collapsed" : "expanded"}`}
      >
        <div className="mb-5">
          <h3 className="menu-main-title">📊 Que voulez-vous découvrir ?</h3>
        </div>
        <div className="mb-4 flex flex-col gap-2 text-[#2c3e50]">
          {BOARD_REGISTRY.map((board) => (
            <button
              key={board.id}
              onClick={() => onBoardChange(board.id)}
              className={`border-gray-300 block w-full cursor-pointer rounded-md border p-3 text-left text-sm transition-all duration-500 hover:translate-y-0 ${
                board.id === selectedBoard
                  ? "bg-[#6e6eb9ff] text-white shadow-[0_2px_4px_rgba(0,123,255,0.3)]"
                  : "bg-white text-[#6e6eb9ff] shadow-[0_1px_2px_rgba(0,0,0,0.1)] hover:bg-[#6e6eb9ff] hover:text-white"
              } `}
            >
              <div className="mb-1 font-semibold">
                {board.emoji} {board.name}
              </div>
              <div className="text-xs leading-tight">{board.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className={`collapsed-buttons ${isCollapsed ? "visible" : ""}`}>
        {BOARD_REGISTRY.map((board) => (
          <div
            key={board.id}
            className={`collapsed-button ${board.id === selectedBoard ? "active" : ""}`}
            onClick={() => onBoardChange(board.id)}
            title={board.name}
          >
            <div className="emoji">{board.emoji}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

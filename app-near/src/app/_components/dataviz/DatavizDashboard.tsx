"use client";

import { useState, useEffect } from "react";
import ExportModal from "./ExportModal";
import { api } from "~/trpc/react";
import SuTabs from "./SuTabs";
import BoardTabs from "./BoardTabs";
import BoardViewer from "./BoardViewer";
import { getBoardById, getDefaultBoard } from "./boards/registry";
import { type MenuState } from "~/types/Dataviz";

const DatavizDashboard: React.FC = () => {
  const [isZoneSelectMode, setIsZoneSelectMode] = useState(false);
  const [exportCanvas, setExportCanvas] = useState<HTMLCanvasElement | null>(
    null,
  );
  const [exportZoneLabel, setExportZoneLabel] = useState<string | undefined>();
  const [isBoardReady, setIsBoardReady] = useState(false);

  const {
    data: allSus,
    isLoading,
    isError,
  } = api.suDataviz.getSuInfo.useQuery();

  const [menuState, setMenuState] = useState<MenuState>(() => {
    const defaultBoard = getDefaultBoard();
    return {
      selectedBoard: defaultBoard.id,
      selectedSus: [],
      availableSus: [],
    };
  });

  useEffect(() => {
    if (allSus && allSus.length > 0 && menuState.availableSus.length === 0) {
      setMenuState((prev) => ({
        ...prev,
        selectedSus: allSus.map((su) => su.su),
        availableSus: allSus,
      }));
    }
  }, [allSus, menuState.availableSus.length]);

  const currentBoard = getBoardById(menuState.selectedBoard);

  const handleBoardChange = (boardId: string) => {
    setIsBoardReady(false);
    setIsZoneSelectMode(false);
    setMenuState((prev) => ({
      ...prev,
      selectedBoard: boardId,
      selectedSus: prev.selectedSus,
    }));
  };

  const handleSusChange = (sus: number[]) => {
    setIsBoardReady(false);
    setMenuState((prev) => ({
      ...prev,
      selectedSus: sus,
    }));
  };

  const toggleZoneSelectMode = () => {
    if (!isBoardReady) return;
    setIsZoneSelectMode((prev) => !prev);
    setExportCanvas(null);
  };

  const handleZoneCapture = (canvas: HTMLCanvasElement, zoneLabel?: string) => {
    setExportCanvas(canvas);
    setExportZoneLabel(zoneLabel);
  };

  const handleModalClose = () => {
    setExportCanvas(null);
    setExportZoneLabel(undefined);
    setIsZoneSelectMode(false);
  };

  const handleChangeVisualization = () => {
    setExportCanvas(null);
    setExportZoneLabel(undefined);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-grayLight border-t-blue" />
          <p className="text-gray">Chargement des données du quartier ...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-3xl">❌</div>
          <p className="text-black">
            Nous n&apos;avons pas pu charger les sphères d&apos;usage
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded bg-blue px-4 py-2 text-white transition hover:opacity-90"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <SuTabs
        availableSus={menuState.availableSus}
        selectedSus={menuState.selectedSus}
        onSusChange={handleSusChange}
      />
      <BoardTabs
        selectedBoard={menuState.selectedBoard}
        onBoardChange={handleBoardChange}
      />

      <div className="relative min-h-0 flex-1 overflow-auto py-5">
        <button
          onClick={toggleZoneSelectMode}
          disabled={!isBoardReady}
          title={!isBoardReady ? "En attente du chargement..." : "Sauvegarder"}
          className={`absolute right-4 top-4 z-30 rounded-full border px-4 py-2 text-sm font-semibold shadow transition disabled:opacity-40 ${
            isZoneSelectMode
              ? "border-blue bg-blue text-white"
              : "border-grayLight bg-white text-blue hover:bg-blue/5"
          }`}
        >
          {isBoardReady ? "📸" : "⏳"} Sauvegarder
        </button>

        <BoardViewer
          isZoneSelectMode={isZoneSelectMode}
          onZoneCapture={handleZoneCapture}
          onBoardReady={setIsBoardReady}
        >
          {currentBoard ? (
            currentBoard.renderComponent({
              selectedSus: menuState.selectedSus,
            })
          ) : (
            <div className="p-10 text-center text-gray">
              <h2 className="mb-4 text-xl">Petit bug</h2>
              <p>Le board ne veut pas s&apos;afficher :(.</p>
            </div>
          )}
        </BoardViewer>
      </div>

      {exportCanvas && (
        <ExportModal
          canvas={exportCanvas}
          onClose={handleModalClose}
          onChangeVisualization={handleChangeVisualization}
          boardName={currentBoard?.name}
          suLabel={
            menuState.selectedSus.length === menuState.availableSus.length
              ? "quartier"
              : menuState.availableSus.find(
                  (su) => su.su === menuState.selectedSus[0],
                )?.bankData?.name
          }
          zoneLabel={exportZoneLabel}
        />
      )}
    </div>
  );
};

export default DatavizDashboard;

"use client";

import { useState, useEffect } from "react";
import ExportModal from "./ExportModal";
import { api } from "~/trpc/react";
import LeftSidebar from "./LeftSidebar";
import BoardViewer from "./BoardViewer";
import RightSidebar from "./RightSidebar";
import { getBoardById, getDefaultBoard } from "./boards/registry";
import { type MenuState } from "~/types/Dataviz";

const DatavizDashboard: React.FC = () => {
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
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

  const toggleLeftSidebar = () => {
    setLeftSidebarCollapsed((prev) => !prev);
  };

  const toggleRightSidebar = () => {
    setRightSidebarCollapsed((prev) => !prev);
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

  const getBoardContainerClass = () => {
    return "board-container";
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Chargement des données du quartier ...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-icon">❌</div>
          <p className="error-message">
            Nous n&apos; pas pu charger les sphères d&apos;usage
          </p>
          <button
            onClick={() => window.location.reload()}
            className="error-retry-button"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dataviz-dashboard">
      <div className="dashboard-grid">
        <aside
          className={`menu-filter ${leftSidebarCollapsed ? "collapsed" : "expanded"}`}
        >
          <LeftSidebar
            availableSus={menuState.availableSus}
            selectedSus={menuState.selectedSus}
            onSusChange={handleSusChange}
            isCollapsed={leftSidebarCollapsed}
            onToggleCollapse={toggleLeftSidebar}
            isZoneSelectMode={isZoneSelectMode}
            onToggleZoneSelectMode={toggleZoneSelectMode}
            isBoardReady={isBoardReady}
          />
        </aside>

        <main className={getBoardContainerClass()}>
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
              <div className="text-gray-500 p-10 text-center">
                <h2 className="mb-4 text-xl">Petit bug</h2>
                <p>Le board ne veut pas s&apos;afficher :(.</p>
              </div>
            )}
          </BoardViewer>
        </main>

        <aside
          className={`board-selector ${rightSidebarCollapsed ? "collapsed" : "expanded"}`}
        >
          <RightSidebar
            selectedBoard={menuState.selectedBoard}
            onBoardChange={handleBoardChange}
            isCollapsed={rightSidebarCollapsed}
            onToggleCollapse={toggleRightSidebar}
          />
        </aside>
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

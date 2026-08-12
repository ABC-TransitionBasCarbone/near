"use client";

import { type SuInfo } from "~/types/Dataviz";
import { api } from "~/trpc/react";
import {
  getFallbackIcon,
  validateAndSanitizeIcon,
} from "../_services/sanitize/icons";
import neighborhoodBank from "../_services/neighborhood/neighborhoodBank.json";

type LeftSidebarProps = {
  availableSus: SuInfo[];
  selectedSus: number[];
  onSusChange: (sus: number[]) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isZoneSelectMode: boolean;
  onToggleZoneSelectMode: () => void;
  isBoardReady: boolean;
};

export default function LeftSidebar({
  availableSus,
  selectedSus,
  onSusChange,
  isCollapsed,
  onToggleCollapse,
  isZoneSelectMode,
  onToggleZoneSelectMode,
  isBoardReady,
}: LeftSidebarProps) {
  const currentSelection = selectedSus.length === 1 ? selectedSus[0] : null;
  const isQuartierSelected =
    selectedSus.length === 0 || selectedSus.length === availableSus.length;

  const selectedSu = availableSus.find((su) => su.su === currentSelection);
  const activeColor =
    selectedSu?.bankData?.colorMain ?? neighborhoodBank.colorMain;

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result?.[1] && result?.[2] && result?.[3]
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : "110, 110, 185";
  };

  const activeColorRgb = hexToRgb(activeColor);

  // CSS variables for dynamic coloring
  const collapsedButtonsStyle: Record<string, string> = {
    "--active-su-color": activeColor,
    "--active-su-color-rgb": activeColorRgb,
  };

  const { data: survey } = api.surveys.getOne.useQuery();
  const quartierName = survey?.name ?? "Quartier";
  const quartierPopulation = survey?.quartier?.population_sum ?? 0;
  const sanitizedIcon2 = validateAndSanitizeIcon(neighborhoodBank.icon2);
  const quartierIcon =
    sanitizedIcon2.isValid && sanitizedIcon2.sanitizedIcon
      ? sanitizedIcon2.sanitizedIcon
      : getFallbackIcon();

  const handleSuSelect = (suNumber: number) => {
    onSusChange([suNumber]);
  };

  const handleQuartierSelect = () => {
    onSusChange(availableSus.map((su) => su.su)); // Quartier = sélectionner toutes les SUs.
  };

  return (
    <div className="sidebar-base sidebar-left">
      <div
        className="collapse-trigger left"
        onClick={onToggleCollapse}
        title={isCollapsed ? "Étendre le menu" : "Réduire le menu"}
      />

      <div
        className={`sidebar-content ${isCollapsed ? "collapsed" : "expanded"}`}
      >
        <div className="sidebar-scrollable">
          <div className="mb-5">
            <h3 className="menu-main-title">
              🔍 Sur qui souhaitez-vous découvrir des choses ?
            </h3>
            <p className="menu-p">
              Vous pouvez découvrir le diag&apos; NEAR 2025 du quartier{" "}
              {quartierName} au complet, ou découvrir les résultats pour les
              différentes Sphères d&apos;Usages.
              <br />
              Une Sphère d&apos;Usages, ou &quot;SU&quot;, est un groupe de la
              population locale qui partage des habitudes quotidiennes proches.
              Il y en a {availableSus.length} dans ce quartier. Chaque SU
              portent un nom d&apos;élément naturel (fruit, minéral, plante). À
              vous de les explorer et de découvrir ce qu&apos;elles ont à dire
              sur le quartier !
            </p>
          </div>

          {/* Bouton Quartier avec même style que les SU */}
          <div
            onClick={handleQuartierSelect}
            className={`relative mb-2 flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 transition-all duration-500 ${
              isQuartierSelected
                ? "border-gray-200 bg-[#002878] text-white"
                : "hover:bg-[#002878]/8 border-[#002878] bg-white text-[#002878]"
            } `}
          >
            <div
              dangerouslySetInnerHTML={{ __html: quartierIcon }}
              className="h-6 w-6 flex-shrink-0"
            />

            <div className="min-w-0 flex-1">
              <div className="mb-0.5 text-sm font-semibold">{quartierName}</div>
              <div className="text-xs">
                <span>Tout le quartier • 100%</span> <br />
                <span>~{quartierPopulation} habitant·es</span>
              </div>
            </div>

            {isQuartierSelected && (
              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#002878]" />
            )}
          </div>

          <div className="flex flex-col gap-2">
            {availableSus.map((su) => {
              const isSelected = currentSelection === su.su;

              return (
                <div
                  key={su.id}
                  onClick={() => handleSuSelect(su.su)}
                  className={`relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 transition-all duration-500 ${
                    isSelected
                      ? "border-gray-200 text-white"
                      : "border-gray-200 hover:border-current bg-white"
                  } `}
                  style={{
                    backgroundColor: isSelected
                      ? su.bankData?.colorMain
                      : "white",
                    borderColor: isSelected
                      ? "#e1e5e9"
                      : su.bankData?.colorMain,
                    color: isSelected ? "white" : su.bankData?.colorMain,
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = `${su.bankData?.colorMain}08`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {/* Icône, protection XSS avec une solution simple de regex dans src/app/lib/icon-validator.ts passé à su-service.ts */}
                  <div
                    dangerouslySetInnerHTML={{ __html: su.icon }}
                    className={`h-6 w-6 flex-shrink-0 ${isSelected ? "invert" : "grayscale-50"}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 text-sm font-semibold">
                      {su.bankData?.name}
                    </div>
                    <div className="text-xs">
                      <span>
                        SU n°{su.su} • {su.popPercentage.toFixed(1)}%
                      </span>
                      <br />
                      <span>~{su.realPopulation} habitant·es</span>
                    </div>
                  </div>

                  {/* Indicateur de sélection */}
                  {isSelected && (
                    <div
                      className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white"
                      style={{ backgroundColor: su.bankData?.colorMain }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section des boutons d'action - Zone fixe en bas */}
        <div className="action-buttons-section">
          <div className="action-buttons-container">
            {/* 
            <button 
              className="action-button"
            >
              ℹ️ Plus d&apos;infos
            </button>
            */}

            {/* 
            <button 
              className="action-button"
            >
              🕵️‍♂️ Quelle est ma S.U. ?
            </button>
            */}

            {/* Sauvegarder */}
            <button
              onClick={onToggleZoneSelectMode}
              disabled={!isBoardReady}
              className={`action-button${isZoneSelectMode ? "action-button--active" : ""}${!isBoardReady ? "action-button--loading" : ""}`}
              title={!isBoardReady ? "En attente du chargement..." : undefined}
            >
              {isBoardReady ? "📸" : "⏳"} Sauvegarder
            </button>
          </div>
        </div>
      </div>

      {/* Collapsed buttons */}
      <div
        className={`collapsed-buttons ${isCollapsed ? "visible" : ""}`}
        style={collapsedButtonsStyle}
      >
        {/* Quartier button */}
        <div
          className={`collapsed-button ${isQuartierSelected ? "active" : ""}`}
          onClick={handleQuartierSelect}
          title={quartierName}
        >
          <div
            dangerouslySetInnerHTML={{ __html: quartierIcon }}
            className="icon"
          />
        </div>

        {/* SU buttons */}
        {availableSus.map((su) => {
          const isSelected = currentSelection === su.su;
          return (
            <div
              key={su.id}
              className={`collapsed-button ${isSelected ? "active" : ""}`}
              onClick={() => handleSuSelect(su.su)}
              title={su.bankData?.name}
              style={{ color: su.bankData?.colorMain }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: su.icon }}
                className="icon"
              />
            </div>
          );
        })}

        {/* Séparateur visuel */}
        <div
          style={{
            width: "30px",
            height: "2px",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: "1px",
            margin: "10px 0",
          }}
        />

        {/* 
        <div 
          className="collapsed-button"
          title="Plus d'infos"
        >
          <div className="emoji">ℹ️</div>
        </div>
        */}

        {/*
        <div 
          className="collapsed-button"
          title="Quelle est ma S.U. ?"
        >
          <div className="emoji">🕵️‍♂️</div>
        </div>
        */}

        <div
          className={`collapsed-button${isZoneSelectMode ? "active" : ""}${!isBoardReady ? "disabled" : ""}`}
          onClick={isBoardReady ? onToggleZoneSelectMode : undefined}
          title={!isBoardReady ? "En attente du chargement..." : "Sauvegarder"}
        >
          <div className="emoji">{isBoardReady ? "📸" : "⏳"}</div>
        </div>
      </div>
    </div>
  );
}

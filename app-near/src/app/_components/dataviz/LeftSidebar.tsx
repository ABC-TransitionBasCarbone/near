"use client";

import React from "react";
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

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  availableSus,
  selectedSus,
  onSusChange,
  isCollapsed,
  onToggleCollapse,
  isZoneSelectMode,
  onToggleZoneSelectMode,
  isBoardReady,
}) => {
  const currentSelection = selectedSus.length === 1 ? selectedSus[0] : null;
  const isQuartierSelected =
    selectedSus.length === 0 || selectedSus.length === availableSus.length;

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
    <div className="relative flex h-full flex-col border-r border-grayLight bg-white">
      <button
        onClick={onToggleCollapse}
        title={isCollapsed ? "Étendre le menu" : "Réduire le menu"}
        className="absolute -right-3 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-grayLight bg-white text-xs text-gray hover:bg-grayExtraLight"
      >
        {isCollapsed ? ">" : "<"}
      </button>

      {isCollapsed ? (
        <div className="flex flex-col items-center gap-3 overflow-y-auto py-4">
          <button
            onClick={handleQuartierSelect}
            title={quartierName}
            className={`flex h-9 w-9 items-center justify-center rounded-full ${isQuartierSelected ? "bg-blue text-white" : "text-blue hover:bg-blue/10"}`}
          >
            <div
              dangerouslySetInnerHTML={{ __html: quartierIcon }}
              className="h-5 w-5"
            />
          </button>

          {availableSus.map((su) => {
            const isSelected = currentSelection === su.su;
            return (
              <button
                key={su.id}
                onClick={() => handleSuSelect(su.su)}
                title={su.bankData?.name}
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{
                  backgroundColor: isSelected
                    ? su.bankData?.colorMain
                    : "transparent",
                  color: isSelected ? "white" : su.bankData?.colorMain,
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: su.icon }}
                  className="h-5 w-5"
                />
              </button>
            );
          })}

          <div className="my-2 w-6 border-t border-grayLight" />

          <button
            onClick={isBoardReady ? onToggleZoneSelectMode : undefined}
            disabled={!isBoardReady}
            title={
              !isBoardReady ? "En attente du chargement..." : "Sauvegarder"
            }
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg disabled:opacity-40 ${isZoneSelectMode ? "bg-blue/10" : "hover:bg-grayExtraLight"}`}
          >
            {isBoardReady ? "📸" : "⏳"}
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 pb-4 pt-10">
            <div className="mb-5">
              <h3 className="mb-2 text-base font-semibold text-black">
                🔍 Sur qui souhaitez-vous découvrir des choses ?
              </h3>
              <p className="text-sm leading-relaxed text-gray">
                Vous pouvez découvrir le diag&apos; NEAR 2025 du quartier{" "}
                {quartierName} au complet, ou découvrir les résultats pour les
                différentes Sphères d&apos;Usages.
                <br />
                Une Sphère d&apos;Usages, ou &quot;SU&quot;, est un groupe de la
                population locale qui partage des habitudes quotidiennes
                proches. Il y en a {availableSus.length} dans ce quartier.
                Chaque SU portent un nom d&apos;élément naturel (fruit, minéral,
                plante). À vous de les explorer et de découvrir ce qu&apos;elles
                ont à dire sur le quartier !
              </p>
            </div>

            <div
              onClick={handleQuartierSelect}
              className={`relative mb-2 flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 transition-all duration-300 ${
                isQuartierSelected
                  ? "border-grayLight bg-blue text-white"
                  : "border-blue bg-white text-blue hover:bg-blue/5"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: quartierIcon }}
                className="h-6 w-6 flex-shrink-0"
              />

              <div className="min-w-0 flex-1">
                <div className="mb-0.5 text-sm font-semibold">
                  {quartierName}
                </div>
                <div className="text-xs">
                  <span>Tout le quartier • 100%</span> <br />
                  <span>~{quartierPopulation} habitant·es</span>
                </div>
              </div>

              {isQuartierSelected && (
                <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-blue" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              {availableSus.map((su) => {
                const isSelected = currentSelection === su.su;

                return (
                  <div
                    key={su.id}
                    onClick={() => handleSuSelect(su.su)}
                    className="relative flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-3.5 py-3 transition-all duration-300"
                    style={{
                      backgroundColor: isSelected
                        ? su.bankData?.colorMain
                        : "white",
                      borderColor: su.bankData?.colorMain,
                      color: isSelected ? "white" : su.bankData?.colorMain,
                    }}
                  >
                    {/* Icône, protection XSS via src/app/_components/_services/sanitize/icons.ts */}
                    <div
                      dangerouslySetInnerHTML={{ __html: su.icon }}
                      className={`h-6 w-6 flex-shrink-0 ${isSelected ? "invert" : ""}`}
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

          <div className="border-t border-grayLight p-4">
            <button
              onClick={onToggleZoneSelectMode}
              disabled={!isBoardReady}
              title={!isBoardReady ? "En attente du chargement..." : undefined}
              className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-40 ${
                isZoneSelectMode
                  ? "bg-blue text-white"
                  : "border border-blue text-blue hover:bg-blue/5"
              }`}
            >
              {isBoardReady ? "📸" : "⏳"} Sauvegarder
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;

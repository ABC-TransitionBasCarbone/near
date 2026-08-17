"use client";

import React from "react";
import { type SuInfo } from "~/types/Dataviz";
import { api } from "~/trpc/react";
import {
  getFallbackIcon,
  validateAndSanitizeIcon,
} from "../_services/sanitize/icons";
import neighborhoodBank from "../_services/neighborhood/neighborhoodBank.json";

type SuTabsProps = {
  availableSus: SuInfo[];
  selectedSus: number[];
  onSusChange: (sus: number[]) => void;
};

const SuTabs: React.FC<SuTabsProps> = ({
  availableSus,
  selectedSus,
  onSusChange,
}) => {
  const currentSelection = selectedSus.length === 1 ? selectedSus[0] : null;
  const isQuartierSelected =
    selectedSus.length === 0 || selectedSus.length === availableSus.length;

  const { data: survey } = api.surveys.getOne.useQuery();
  const quartierName = survey?.name ?? "Quartier";
  const sanitizedIcon2 = validateAndSanitizeIcon(neighborhoodBank.icon2);
  const quartierIcon =
    sanitizedIcon2.isValid && sanitizedIcon2.sanitizedIcon
      ? sanitizedIcon2.sanitizedIcon
      : getFallbackIcon();

  return (
    <div className="border-b border-grayLight bg-white px-4 py-5">
      <h3 className="mb-2 text-sm font-semibold text-black">
        🔍 Sur qui souhaitez-vous découvrir des choses ?
      </h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSusChange(availableSus.map((su) => su.su))}
          className={`flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition ${
            isQuartierSelected
              ? "border-blue bg-blue text-white"
              : "border-blue text-blue hover:bg-blue/5"
          }`}
        >
          <div
            dangerouslySetInnerHTML={{ __html: quartierIcon }}
            className={`h-4 w-4 flex-shrink-0 ${isQuartierSelected ? "invert" : ""}`}
          />
          {quartierName}
        </button>

        {availableSus.map((su) => {
          const isSelected = currentSelection === su.su;
          return (
            <button
              key={su.id}
              onClick={() => onSusChange([su.su])}
              className="flex items-center gap-2 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition"
              style={{
                backgroundColor: isSelected ? su.bankData?.colorMain : "white",
                borderColor: su.bankData?.colorMain,
                color: isSelected ? "white" : su.bankData?.colorMain,
              }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: su.icon }}
                className={`h-4 w-4 flex-shrink-0 ${isSelected ? "invert" : ""}`}
              />
              {su.bankData?.name ?? `SU n°${su.su}`}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SuTabs;

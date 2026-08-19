"use client";

import { api } from "~/trpc/react";
import neighborhoodBank from "~/app/_components/_services/neighborhood/neighborhoodBank.json";
import { type SuBankData } from "~/types/Dataviz";

export type PaletteType = "gradient" | "graph" | "comp";

const NEIGHBORHOOD_BANK: SuBankData = neighborhoodBank;

export const getPalette = (bank: SuBankData, type: PaletteType): string[] => {
  switch (type) {
    case "gradient":
      return [
        bank.colorLight5,
        bank.colorLight4,
        bank.colorLight3,
        bank.colorLight2,
        bank.colorLight1,
        bank.colorMain,
        bank.colorDark1,
        bank.colorDark2,
        bank.colorDark3,
        bank.colorDark4,
        bank.colorDark5,
      ];
    case "graph":
      return [
        bank.colorGraph1,
        bank.colorGraph2,
        bank.colorGraph3,
        bank.colorGraph4,
        bank.colorGraph5,
        bank.colorGraph6,
        bank.colorGraph7,
        bank.colorGraph8,
        bank.colorGraph9,
        bank.colorGraph10,
      ];
    case "comp":
      return [bank.colorMain, bank.colorComp1];
  }
};

export const useSuBank = (selectedSus?: number[]): SuBankData => {
  const { data: allSus } = api.suDataviz.getSuInfo.useQuery();

  if (selectedSus?.length === 1) {
    const su = allSus?.find((s) => s.su === selectedSus[0]);
    if (su?.bankData) return su.bankData;
  }

  return NEIGHBORHOOD_BANK;
};

import { type SuBankData } from "~/types/Dataviz";
import { db } from "~/server/db";
import {
  assignSuBanksInRoundRobin,
  deleteRemovedSuBanks,
  upsertSuBanks,
} from ".";

export const assignSuBanksToSuData = async (suBankSeeds: SuBankData[]) => {
  const suBanks = await Promise.all(
    suBankSeeds.map(({ id }) => db.suBank.findUniqueOrThrow({ where: { id } })),
  );

  await assignSuBanksInRoundRobin(suBanks.map(({ id }) => id));
};

export const initSuBank = async (suBankSeeds: SuBankData[]) => {
  await upsertSuBanks(suBankSeeds);
  await deleteRemovedSuBanks(suBankSeeds);
  await assignSuBanksToSuData(suBankSeeds);
};

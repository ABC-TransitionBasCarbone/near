import { db } from "~/server/db";
import {
  assignSuBanksInRoundRobin,
  deleteRemovedSuBanks,
  type SuBankSeed,
  upsertSuBanks,
} from ".";

export const assignSuBanksToSuData = async (suBankSeeds: SuBankSeed[]) => {
  const suBanks = await Promise.all(
    suBankSeeds.map(({ id }) => db.suBank.findUniqueOrThrow({ where: { id } })),
  );

  await assignSuBanksInRoundRobin(suBanks.map(({ id }) => id));
};

export const initSuBank = async (suBankSeeds: SuBankSeed[]) => {
  await upsertSuBanks(suBankSeeds);
  await deleteRemovedSuBanks(suBankSeeds);
  await assignSuBanksToSuData(suBankSeeds);
};

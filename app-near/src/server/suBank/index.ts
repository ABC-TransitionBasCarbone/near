import { type SuBankData } from "~/types/Dataviz";
import { db } from "../db";

export type SuBankSeed = SuBankData;

const freeUpName = async (name: string, id: number) => {
  const conflictingSuBank = await db.suBank.findUnique({ where: { name } });

  if (conflictingSuBank && conflictingSuBank.id !== id) {
    await db.suBank.update({
      where: { id: conflictingSuBank.id },
      data: { name: `__pending_rename_${conflictingSuBank.id}` },
    });
  }
};

const freeUpColorMain = async (colorMain: string, id: number) => {
  const conflictingSuBank = await db.suBank.findUnique({
    where: { colorMain },
  });

  if (conflictingSuBank && conflictingSuBank.id !== id) {
    await db.suBank.update({
      where: { id: conflictingSuBank.id },
      data: { colorMain: `__pending_rename_${conflictingSuBank.id}` },
    });
  }
};

export const upsertSuBanks = async (suBankSeeds: SuBankSeed[]) => {
  for (const suBankSeed of suBankSeeds) {
    const { id, name, colorMain } = suBankSeed;
    await freeUpName(name, id);
    await freeUpColorMain(colorMain, id);

    await db.suBank.upsert({
      where: { id },
      update: suBankSeed,
      create: suBankSeed,
    });
  }
};

export const deleteRemovedSuBanks = async (suBankSeeds: SuBankSeed[]) => {
  await db.suBank.deleteMany({
    where: { id: { notIn: suBankSeeds.map(({ id }) => id) } },
  });
};

export const assignSuBanksInRoundRobin = async (suBankIds: number[]) => {
  if (suBankIds.length === 0) {
    throw new Error("No su_bank available to assign");
  }

  const lastAssignedSuData = await db.suData.findFirst({
    where: { suBankId: { not: null } },
    orderBy: { id: "desc" },
  });

  const lastUsedIndex = lastAssignedSuData
    ? suBankIds.findIndex((id) => id === lastAssignedSuData.suBankId)
    : -1;

  const unassignedSuData = await db.suData.findMany({
    where: { suBankId: null },
    orderBy: [{ surveyId: "asc" }, { su: "asc" }],
  });

  for (const [offset, suData] of unassignedSuData.entries()) {
    const suBankId =
      suBankIds[(lastUsedIndex + 1 + offset) % suBankIds.length]!;

    await db.suData.update({
      where: { id: suData.id },
      data: { suBankId },
    });
  }
};

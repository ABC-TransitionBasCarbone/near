import { db } from "~/server/db";

export type SuBankSeed = {
  id: number;
  name: string;
  colorMain: string;
};

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
  for (const { id, name, colorMain } of suBankSeeds) {
    await freeUpName(name, id);
    await freeUpColorMain(colorMain, id);

    await db.suBank.upsert({
      where: { id },
      update: { name, colorMain },
      create: { id, name, colorMain },
    });
  }
};

export const deleteRemovedSuBanks = async (suBankSeeds: SuBankSeed[]) => {
  await db.suBank.deleteMany({
    where: { id: { notIn: suBankSeeds.map(({ id }) => id) } },
  });
};

export const assignSuBanksToSuData = async (suBankSeeds: SuBankSeed[]) => {
  const suBanks = await Promise.all(
    suBankSeeds.map(({ id }) => db.suBank.findUniqueOrThrow({ where: { id } })),
  );

  if (suBanks.length === 0) {
    throw new Error("No su_bank available to assign");
  }

  const lastAssignedSuData = await db.suData.findFirst({
    where: { suBankId: { not: null } },
    orderBy: { id: "desc" },
  });

  const lastUsedIndex = lastAssignedSuData
    ? suBanks.findIndex((suBank) => suBank.id === lastAssignedSuData.suBankId)
    : -1;

  const unassignedSuData = await db.suData.findMany({
    where: { suBankId: null },
    orderBy: [{ surveyId: "asc" }, { su: "asc" }],
  });

  for (const [offset, suData] of unassignedSuData.entries()) {
    const suBank = suBanks[(lastUsedIndex + 1 + offset) % suBanks.length]!;

    await db.suData.update({
      where: { id: suData.id },
      data: { suBankId: suBank.id },
    });
  }
};

export const initSuBank = async (suBankSeeds: SuBankSeed[]) => {
  await upsertSuBanks(suBankSeeds);
  await deleteRemovedSuBanks(suBankSeeds);
  await assignSuBanksToSuData(suBankSeeds);
};

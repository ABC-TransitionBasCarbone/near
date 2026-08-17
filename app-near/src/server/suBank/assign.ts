import { assignSuBanksInRoundRobin } from ".";
import { db } from "../db";

export const assignAvailableSuBanksToSuData = async () => {
  const suBanks = await db.suBank.findMany({ orderBy: { id: "asc" } });

  await assignSuBanksInRoundRobin(suBanks.map(({ id }) => id));
};

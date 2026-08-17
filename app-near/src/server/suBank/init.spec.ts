import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { type SuBankSeed } from ".";
import { assignSuBanksToSuData, initSuBank } from "./init";

describe("suBank/init", () => {
  const surveyName = "survey-test-su-bank-init";
  let surveyId: number;

  const suBankSeeds: SuBankSeed[] = [
    { id: 0, name: "bank-a", colorMain: "#111111" },
    { id: 1, name: "bank-b", colorMain: "#222222" },
    { id: 2, name: "bank-c", colorMain: "#333333" },
  ];

  const createSuData = async (su: number) =>
    db.suData.create({
      data: { surveyId, su, popPercentage: 1, barycenter: [0] },
    });

  beforeEach(async () => {
    await clearAlldata();

    surveyId = (await db.survey.create({ data: { name: surveyName } })).id;
  });

  describe("assignSuBanksToSuData", () => {
    it("throws if a seed references a su_bank id that does not exist yet", async () => {
      await expect(assignSuBanksToSuData(suBankSeeds)).rejects.toThrow();
    });

    it("resolves the seed ids and assigns them to unassigned su_data", async () => {
      await db.suBank.createMany({ data: suBankSeeds });
      const su = await createSuData(1);

      await assignSuBanksToSuData(suBankSeeds);

      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBe(suBankSeeds[0]!.id);
    });
  });

  describe("initSuBank", () => {
    it("creates the su_bank rows from the seed", async () => {
      await initSuBank(suBankSeeds);

      const suBanks = await db.suBank.findMany({ orderBy: { id: "asc" } });

      expect(
        suBanks.map(({ name, colorMain }) => ({ name, colorMain })),
      ).toStrictEqual(
        suBankSeeds.map(({ name, colorMain }) => ({ name, colorMain })),
      );
    });

    it("assigns a su_bank to unassigned su_data", async () => {
      const su = await createSuData(1);

      await initSuBank(suBankSeeds);

      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBe(suBankSeeds[0]!.id);
    });

    it("deletes su_bank rows that are no longer in the seed and reassigns their su_data", async () => {
      await initSuBank(suBankSeeds);
      const su = await createSuData(1);
      await initSuBank(suBankSeeds);
      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBe(0);

      const remainingSeeds = suBankSeeds.slice(1);
      await initSuBank(remainingSeeds);

      const remainingBanks = await db.suBank.findMany({
        orderBy: { id: "asc" },
      });
      expect(remainingBanks.map(({ id }) => id)).toStrictEqual([1, 2]);

      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBe(1);
    });
  });
});

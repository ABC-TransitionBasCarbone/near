import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { buildSuBank } from "~/server/test-utils/create-data/suBank";
import {
  assignSuBanksInRoundRobin,
  deleteRemovedSuBanks,
  type SuBankSeed,
  upsertSuBanks,
} from ".";

describe("suBank", () => {
  const surveyName = "survey-test-su-bank-index";
  let surveyId: number;

  const suBankSeeds: SuBankSeed[] = [
    buildSuBank({ id: 0, name: "bank-a", colorMain: "#111111" }),
    buildSuBank({ id: 1, name: "bank-b", colorMain: "#222222" }),
    buildSuBank({ id: 2, name: "bank-c", colorMain: "#333333" }),
  ];

  const createSuData = async (su: number) =>
    db.suData.create({
      data: { surveyId, su, popPercentage: 1, barycenter: [0] },
    });

  beforeEach(async () => {
    await clearAlldata();

    surveyId = (await db.survey.create({ data: { name: surveyName } })).id;
  });

  describe("upsertSuBanks", () => {
    it("creates the su_bank rows from the seed", async () => {
      await upsertSuBanks(suBankSeeds);

      const suBanks = await db.suBank.findMany({ orderBy: { id: "asc" } });

      expect(
        suBanks.map(({ name, colorMain }) => ({ name, colorMain })),
      ).toStrictEqual(
        suBankSeeds.map(({ name, colorMain }) => ({ name, colorMain })),
      );
    });

    it("updates colorMain without creating duplicates when run twice", async () => {
      await upsertSuBanks(suBankSeeds);
      await upsertSuBanks([
        buildSuBank({ id: 0, name: "bank-a", colorMain: "#ABCDEF" }),
        ...suBankSeeds.slice(1),
      ]);

      const suBanks = await db.suBank.findMany();

      expect(suBanks).toHaveLength(suBankSeeds.length);
      expect(suBanks.find(({ name }) => name === "bank-a")?.colorMain).toBe(
        "#ABCDEF",
      );
    });

    it("frees up a name already used by a different su_bank id", async () => {
      await upsertSuBanks(suBankSeeds);

      await upsertSuBanks([
        buildSuBank({ id: 0, name: "bank-b", colorMain: "#111111" }),
        buildSuBank({ id: 1, name: "bank-a", colorMain: "#222222" }),
        suBankSeeds[2]!,
      ]);

      const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });

      expect(banks.map(({ id, name }) => ({ id, name }))).toStrictEqual([
        { id: 0, name: "bank-b" },
        { id: 1, name: "bank-a" },
        { id: 2, name: "bank-c" },
      ]);
    });

    it("frees up a colorMain already used by a different su_bank id", async () => {
      await upsertSuBanks(suBankSeeds);

      await upsertSuBanks([
        buildSuBank({ id: 0, name: "bank-a", colorMain: "#222222" }),
        buildSuBank({ id: 1, name: "bank-b", colorMain: "#111111" }),
        suBankSeeds[2]!,
      ]);

      const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });

      expect(
        banks.map(({ id, colorMain }) => ({ id, colorMain })),
      ).toStrictEqual([
        { id: 0, colorMain: "#222222" },
        { id: 1, colorMain: "#111111" },
        { id: 2, colorMain: "#333333" },
      ]);
    });
  });

  describe("deleteRemovedSuBanks", () => {
    it("deletes su_bank rows that are no longer in the seed and unassigns their su_data", async () => {
      await upsertSuBanks(suBankSeeds);
      const su = await createSuData(1);
      await db.suData.update({
        where: { id: su.id },
        data: { suBankId: 0 },
      });

      await deleteRemovedSuBanks(suBankSeeds.slice(1));

      const remainingBanks = await db.suBank.findMany({
        orderBy: { id: "asc" },
      });
      expect(remainingBanks.map(({ id }) => id)).toStrictEqual([1, 2]);

      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBeNull();
    });
  });

  describe("assignSuBanksInRoundRobin", () => {
    beforeEach(() => upsertSuBanks(suBankSeeds));

    it("throws when no su_bank id is given", async () => {
      await expect(assignSuBanksInRoundRobin([])).rejects.toThrow(
        "No su_bank available to assign",
      );
    });

    it("assigns su_bank incrementally, ordered by survey and su, when none are assigned yet", async () => {
      const su2 = await createSuData(2);
      const su1 = await createSuData(1);

      await assignSuBanksInRoundRobin(suBankSeeds.map(({ id }) => id));

      const [assignedSu1, assignedSu2] = await Promise.all([
        db.suData.findUniqueOrThrow({ where: { id: su1.id } }),
        db.suData.findUniqueOrThrow({ where: { id: su2.id } }),
      ]);

      expect(assignedSu1.suBankId).toBe(0);
      expect(assignedSu2.suBankId).toBe(1);
    });

    it("wraps around to the first su_bank once the last one has been used", async () => {
      const suBankIds = suBankSeeds.map(({ id }) => id);
      await assignSuBanksInRoundRobin(suBankIds);

      for (let su = 1; su <= 4; su++) {
        await createSuData(su);
      }
      await assignSuBanksInRoundRobin(suBankIds);

      const assigned = await db.suData.findMany({
        where: { surveyId },
        orderBy: { su: "asc" },
      });

      expect(assigned.map((suData) => suData.suBankId)).toStrictEqual([
        0, 1, 2, 0,
      ]);
    });

    it("resumes right after the last used su_bank for newly unassigned su_data", async () => {
      const suBankIds = suBankSeeds.map(({ id }) => id);

      const su1 = await createSuData(1);
      await assignSuBanksInRoundRobin(suBankIds);
      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su1.id } })).suBankId,
      ).toBe(0);

      const su2 = await createSuData(2);
      await assignSuBanksInRoundRobin(suBankIds);
      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su2.id } })).suBankId,
      ).toBe(1);
    });

    it("does not touch su_data that already has a su_bank", async () => {
      const suBankIds = suBankSeeds.map(({ id }) => id);
      const su = await createSuData(1);
      await assignSuBanksInRoundRobin(suBankIds);
      const firstAssignment = (
        await db.suData.findUniqueOrThrow({ where: { id: su.id } })
      ).suBankId;

      await assignSuBanksInRoundRobin(suBankIds);

      expect(
        (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
      ).toBe(firstAssignment);
    });
  });
});

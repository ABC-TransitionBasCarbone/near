import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { type SuBankSeed, initSuBank } from "./init";

describe("initSuBank", () => {
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

  it("creates the su_bank rows from the seed", async () => {
    await initSuBank(suBankSeeds);

    const suBanks = await db.suBank.findMany({ orderBy: { id: "asc" } });

    expect(
      suBanks.map(({ name, colorMain }) => ({ name, colorMain })),
    ).toStrictEqual(
      suBankSeeds.map(({ name, colorMain }) => ({ name, colorMain })),
    );
  });

  it("updates colorMain without creating duplicates when run twice", async () => {
    await initSuBank(suBankSeeds);
    await initSuBank([
      { id: 0, name: "bank-a", colorMain: "#ABCDEF" },
      ...suBankSeeds.slice(1),
    ]);

    const suBanks = await db.suBank.findMany();

    expect(suBanks).toHaveLength(suBankSeeds.length);
    expect(suBanks.find(({ name }) => name === "bank-a")?.colorMain).toBe(
      "#ABCDEF",
    );
  });

  it("assigns su_bank incrementally, ordered by survey and su, when none are assigned yet", async () => {
    const su2 = await createSuData(2);
    const su1 = await createSuData(1);

    await initSuBank(suBankSeeds);

    const [assignedSu1, assignedSu2] = await Promise.all([
      db.suData.findUniqueOrThrow({ where: { id: su1.id } }),
      db.suData.findUniqueOrThrow({ where: { id: su2.id } }),
    ]);
    const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });

    expect(assignedSu1.suBankId).toBe(banks[0]!.id);
    expect(assignedSu2.suBankId).toBe(banks[1]!.id);
  });

  it("wraps around to the first su_bank once the last one has been used", async () => {
    await initSuBank(suBankSeeds);
    const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });

    for (let su = 1; su <= 4; su++) {
      await createSuData(su);
    }
    await initSuBank(suBankSeeds);

    const assigned = await db.suData.findMany({
      where: { surveyId },
      orderBy: { su: "asc" },
    });

    expect(assigned.map((suData) => suData.suBankId)).toStrictEqual([
      banks[0]!.id,
      banks[1]!.id,
      banks[2]!.id,
      banks[0]!.id,
    ]);
  });

  it("resumes right after the last used su_bank for newly unassigned su_data", async () => {
    const su1 = await createSuData(1);
    await initSuBank(suBankSeeds);
    const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });
    expect(
      (await db.suData.findUniqueOrThrow({ where: { id: su1.id } })).suBankId,
    ).toBe(banks[0]!.id);

    const su2 = await createSuData(2);
    await initSuBank(suBankSeeds);

    expect(
      (await db.suData.findUniqueOrThrow({ where: { id: su2.id } })).suBankId,
    ).toBe(banks[1]!.id);
  });

  it("does not touch su_data that already has a su_bank", async () => {
    const su = await createSuData(1);
    await initSuBank(suBankSeeds);
    const firstAssignment = (
      await db.suData.findUniqueOrThrow({ where: { id: su.id } })
    ).suBankId;

    await initSuBank(suBankSeeds);

    expect(
      (await db.suData.findUniqueOrThrow({ where: { id: su.id } })).suBankId,
    ).toBe(firstAssignment);
  });

  it("frees up a name already used by a different su_bank id", async () => {
    await initSuBank(suBankSeeds);

    await initSuBank([
      { id: 0, name: "bank-b", colorMain: "#111111" },
      { id: 1, name: "bank-a", colorMain: "#222222" },
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
    await initSuBank(suBankSeeds);

    await initSuBank([
      { id: 0, name: "bank-a", colorMain: "#222222" },
      { id: 1, name: "bank-b", colorMain: "#111111" },
      suBankSeeds[2]!,
    ]);

    const banks = await db.suBank.findMany({ orderBy: { id: "asc" } });

    expect(banks.map(({ id, colorMain }) => ({ id, colorMain }))).toStrictEqual(
      [
        { id: 0, colorMain: "#222222" },
        { id: 1, colorMain: "#111111" },
        { id: 2, colorMain: "#333333" },
      ],
    );
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

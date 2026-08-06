import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { buildSuBank } from "~/server/test-utils/create-data/suBank";
import { assignAvailableSuBanksToSuData } from "./assign";

describe("assignAvailableSuBanksToSuData", () => {
  const surveyName = "survey-test-su-bank-assign";
  let surveyId: number;

  const createSuBanks = () =>
    db.suBank.createManyAndReturn({
      data: [
        buildSuBank({ id: 1, name: "bank-a", colorMain: "#111111" }),
        buildSuBank({ id: 2, name: "bank-b", colorMain: "#222222" }),
        buildSuBank({ id: 3, name: "bank-c", colorMain: "#333333" }),
      ],
    });

  const createSuData = async (su: number) =>
    db.suData.create({
      data: { surveyId, su, popPercentage: 1, barycenter: [0] },
    });

  beforeEach(async () => {
    await clearAlldata();

    surveyId = (await db.survey.create({ data: { name: surveyName } })).id;
  });

  it("throws when no su_bank exists", async () => {
    await createSuData(1);

    await expect(assignAvailableSuBanksToSuData()).rejects.toThrow(
      "No su_bank available to assign",
    );
  });

  it("assigns every existing su_bank, ordered by id, to unassigned su_data", async () => {
    const suBanks = await createSuBanks();
    await createSuData(1);
    await createSuData(2);
    await createSuData(3);

    await assignAvailableSuBanksToSuData();

    const assigned = await db.suData.findMany({
      where: { surveyId },
      orderBy: { su: "asc" },
    });

    expect(assigned.map((suData) => suData.suBankId)).toStrictEqual(
      suBanks.map(({ id }) => id),
    );
  });
});

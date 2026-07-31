import { type CarbonFootprintAnswer, type Survey } from "@prisma/client";
import { db } from "~/server/db";
import { countBySu } from "./count";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { buildCarbonFootprintAnswer } from "~/server/test-utils/create-data/carbonFootprintAnswer";
import { buildWayOfLifeAnswer } from "~/server/test-utils/create-data/wayOfLifeAnswer";
import { clearAlldata } from "~/server/test-utils/clear";

describe("countBySu", () => {
  let survey: Survey;
  const surveyName = "survey-test-su-data-get";

  beforeEach(async () => {
    await clearAlldata();

    survey = await createNeighborhood(surveyName);
  });

  it("should return an empty array when no su data exists", async () => {
    const result = await countBySu(survey.id);

    expect(result).toStrictEqual([]);
  });

  it("should return the su, popPercentage and answer counts for each su segment", async () => {
    const [suBank1, suBank2] = await db.suBank.createManyAndReturn({
      data: [
        { id: 1, name: "bank-a", colorMain: "#111111" },
        { id: 2, name: "bank-b", colorMain: "#222222" },
      ],
    });
    const suData1 = await db.suData.create({
      data: {
        surveyId: survey.id,
        id: 1,
        su: 12,
        suBankId: suBank1!.id,
        popPercentage: 33.33,
        barycenter: [1, 2, 3],
      },
    });
    const suData2 = await db.suData.create({
      data: {
        surveyId: survey.id,
        id: 2,
        su: 22,
        suBankId: suBank2!.id,
        popPercentage: 66.67,
        barycenter: [4, 5, 6],
      },
    });

    await db.carbonFootprintAnswer.createMany({
      // @ts-expect-error unexpecte typescript error for answers
      data: [suData1.id, suData1.id, suData2.id].map(
        (suId) =>
          buildCarbonFootprintAnswer(survey.id, {
            suId,
          }) as CarbonFootprintAnswer,
      ),
    });
    await db.wayOfLifeAnswer.createMany({
      data: [
        buildWayOfLifeAnswer(survey.id, { suId: suData1.id }),
        buildWayOfLifeAnswer(survey.id, { suId: suData2.id }),
        buildWayOfLifeAnswer(survey.id, { suId: suData2.id }),
        buildWayOfLifeAnswer(survey.id, { suId: suData2.id }),
      ],
    });

    const result = await countBySu(survey.id);

    expect(result).toStrictEqual(
      expect.arrayContaining([
        {
          id: suData1.id,
          su: suBank1!.name,
          popPercentage: 33.33,
          carbonFootprintAnswerCount: 2,
          wayOfLifeAnswerCount: 1,
        },
        {
          id: suData2.id,
          su: suBank2!.name,
          popPercentage: 66.67,
          carbonFootprintAnswerCount: 1,
          wayOfLifeAnswerCount: 3,
        },
      ]),
    );
  });

  it("should return answer counts of 0 for su segments without any answer", async () => {
    const suBank = await db.suBank.create({
      data: { id: 1, name: "bank-a", colorMain: "#111111" },
    });
    const suData = await db.suData.create({
      data: {
        surveyId: survey.id,
        id: 1,
        su: 12,
        suBankId: suBank.id,
        popPercentage: 100,
        barycenter: [1, 2, 3],
      },
    });

    const result = await countBySu(survey.id);

    expect(result).toStrictEqual([
      {
        id: suData.id,
        su: suBank.name,
        popPercentage: 100,
        carbonFootprintAnswerCount: 0,
        wayOfLifeAnswerCount: 0,
      },
    ]);
  });

  it("should return an empty string for su segments without a su_bank assigned", async () => {
    const suData = await db.suData.create({
      data: {
        surveyId: survey.id,
        id: 1,
        su: 12,
        popPercentage: 100,
        barycenter: [1, 2, 3],
      },
    });

    const result = await countBySu(survey.id);

    expect(result).toStrictEqual([
      {
        id: suData.id,
        su: "",
        popPercentage: 100,
        carbonFootprintAnswerCount: 0,
        wayOfLifeAnswerCount: 0,
      },
    ]);
  });

  it("should not return su data from other surveys", async () => {
    const otherSurvey = await createNeighborhood("survey-test-su-data-get-2");

    await db.suData.create({
      data: {
        surveyId: otherSurvey.id,
        id: 1,
        su: 1,
        popPercentage: 50,
        barycenter: [1, 2, 3],
      },
    });

    const result = await countBySu(survey.id);

    expect(result).toStrictEqual([]);
  });
});

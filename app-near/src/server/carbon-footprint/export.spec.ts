import { type CarbonFootprintAnswer } from "@prisma/client";
import { db } from "~/server/db";
import { buildCSVFromCarbonFootprintAnswers } from "./export";
import { buildCarbonFootprintAnswer } from "~/server/test-utils/create-data/carbonFootprintAnswer";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { clearAlldata } from "~/server/test-utils/clear";

describe("buildCSVFromCarbonFootprintAnswers", () => {
  const surveyName = "survey-test-export-carbon-footprint";
  let surveyId: number;

  beforeEach(async () => {
    await clearAlldata();
    const survey = await createNeighborhood(surveyName);
    surveyId = survey.id;
  });

  it("should return an empty string when there is no answer", async () => {
    expect(await buildCSVFromCarbonFootprintAnswers(surveyId)).toBe("");
  });

  it("should export only the current survey's carbon footprint answers, ordered by id, with the linked SU value", async () => {
    const otherSurvey = await createNeighborhood(
      "survey-test-export-carbon-footprint-other",
    );

    await db.suData.create({
      data: { id: 1, surveyId, su: 11, popPercentage: 0.11, barycenter: {} },
    });
    await db.suData.create({
      data: {
        id: 2,
        surveyId: otherSurvey.id,
        su: 22,
        popPercentage: 0.22,
        barycenter: {},
      },
    });

    await db.carbonFootprintAnswer.create({
      // @ts-expect-error allow for test
      data: buildCarbonFootprintAnswer(otherSurvey.id, {
        email: "other@mail.com",
        suId: 2,
      }),
    });

    const carbonFootprintAnswers = [
      buildCarbonFootprintAnswer(surveyId, {
        id: 2,
        email: "second@mail.com",
        suId: 1,
      }),
      buildCarbonFootprintAnswer(surveyId, {
        id: 1,
        email: "first@mail.com",
        suId: 1,
      }),
    ];

    await db.carbonFootprintAnswer.createMany({
      // @ts-expect-error allow for test
      data: carbonFootprintAnswers as CarbonFootprintAnswer[],
    });

    const csv = await buildCSVFromCarbonFootprintAnswers(surveyId);

    expect(csv).toBe(
      ["SU,Email", "11,first@mail.com", "11,second@mail.com"].join("\r\n"),
    );
  });
});

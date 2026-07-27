import { type Survey } from "@prisma/client";
import { db } from "~/server/db";
import { getSuVolumes } from "./get";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { clearAlldata } from "~/server/test-utils/clear";

describe("getSuVolumes", () => {
  let survey: Survey;
  const surveyName = "survey-test-su-data-get";

  beforeEach(async () => {
    await clearAlldata();

    survey = await createNeighborhood(surveyName);
  });

  it("should return an empty array when no su data exists", async () => {
    const result = await getSuVolumes(survey.id);

    expect(result).toStrictEqual([]);
  });

  it("should return the su and popPercentage for each su segment", async () => {
    await db.suData.createMany({
      data: [
        {
          surveyId: survey.id,
          su: 1,
          popPercentage: 33.33,
          barycenter: [1, 2, 3],
        },
        {
          surveyId: survey.id,
          su: 2,
          popPercentage: 66.67,
          barycenter: [4, 5, 6],
        },
      ],
    });

    const result = await getSuVolumes(survey.id);

    expect(result).toStrictEqual(
      expect.arrayContaining([
        { su: 1, popPercentage: 33.33 },
        { su: 2, popPercentage: 66.67 },
      ]),
    );
  });

  it("should not return su data from other surveys", async () => {
    const otherSurvey = await createNeighborhood("survey-test-su-data-get-2");

    await db.suData.create({
      data: {
        surveyId: otherSurvey.id,
        su: 1,
        popPercentage: 50,
        barycenter: [1, 2, 3],
      },
    });

    const result = await getSuVolumes(survey.id);

    expect(result).toStrictEqual([]);
  });
});

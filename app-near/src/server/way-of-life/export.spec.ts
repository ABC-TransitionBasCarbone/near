import { db } from "~/server/db";
import { buildCSVFromWayOfLifeAnswers } from "./export";
import { buildWayOfLifeAnswer } from "~/server/test-utils/create-data/wayOfLifeAnswer";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { clearAlldata } from "~/server/test-utils/clear";
import { AgeCategory, Gender } from "@prisma/client";

describe("buildCSVFromWayOfLifeAnswers", () => {
  const surveyName = "survey-test-export-way-of-life";
  let surveyId: number;

  beforeEach(async () => {
    await clearAlldata();
    const survey = await createNeighborhood(surveyName);
    surveyId = survey.id;
  });

  it("should return an empty string when there is no answer", async () => {
    expect(await buildCSVFromWayOfLifeAnswers(surveyId)).toBe("");
  });

  it("should export only the current survey's way of life answers, ordered by id, with the linked SU value", async () => {
    const otherSurvey = await createNeighborhood(
      "survey-test-export-way-of-life-other",
    );
    await db.wayOfLifeAnswer.create({
      data: buildWayOfLifeAnswer(otherSurvey.id, { email: "other@mail.com" }),
    });

    await db.suData.create({
      data: { id: 1, surveyId, su: 11, popPercentage: 0.11, barycenter: {} },
    });

    await db.wayOfLifeAnswer.createMany({
      data: [
        buildWayOfLifeAnswer(surveyId, {
          id: 2,
          email: "second@mail.com",
          ageCategory: AgeCategory.ABOVE_75,
          gender: Gender.WOMAN,
          suId: 1,
        }),
        buildWayOfLifeAnswer(surveyId, {
          id: 1,
          email: "first@mail.com",
          ageCategory: AgeCategory.FROM_15_TO_29,
          gender: Gender.MAN,
          suId: null,
        }),
      ],
    });

    const csv = await buildCSVFromWayOfLifeAnswers(surveyId);

    expect(csv).toBe(
      [
        "SU,Email,Age,Genre",
        ",first@mail.com,FROM_15_TO_29,MAN",
        "11,second@mail.com,ABOVE_75,WOMAN",
      ].join("\r\n"),
    );
  });
});

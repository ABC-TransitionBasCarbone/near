import { db } from "~/server/db";
import { buildCSVFromSUAnswers } from "./export";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { clearAlldata } from "~/server/test-utils/clear";
import { AgeCategory, Gender, ProfessionalCategory } from "@prisma/client";

describe("buildCSVFromSUAnswers", () => {
  const surveyName = "survey-test-export";
  let surveyId: number;

  beforeEach(async () => {
    await clearAlldata();
    const survey = await createNeighborhood(surveyName);
    surveyId = survey.id;
  });

  it("should return only the header row when there is no answer", async () => {
    const csv = await buildCSVFromSUAnswers(surveyId);

    expect(csv).toBe("Email,Genre,Age,CSP,SU");
  });

  it("should not include answers from another survey", async () => {
    const otherSurvey = await createNeighborhood("survey-test-export-other");
    await db.suAnswer.create({
      data: buildSuAnswer(otherSurvey.id, { email: "other@mail.com" }),
    });

    const csv = await buildCSVFromSUAnswers(surveyId);

    expect(csv).toBe("Email,Genre,Age,CSP,SU");
  });

  it("should export SU answers as CSV rows, ordered by id, with the linked SU value", async () => {
    await db.suData.create({
      data: {
        id: 1,
        surveyId,
        su: 11,
        popPercentage: 0.11,
        barycenter: {},
      },
    });

    await db.suAnswer.createMany({
      data: [
        buildSuAnswer(surveyId, {
          id: 2,
          email: "second@mail.com",
          gender: Gender.WOMAN,
          ageCategory: AgeCategory.ABOVE_75,
          professionalCategory: ProfessionalCategory.CS1,
          suId: 1,
        }),
        buildSuAnswer(surveyId, {
          id: 1,
          email: "first@mail.com",
          gender: Gender.MAN,
          ageCategory: AgeCategory.FROM_15_TO_29,
          professionalCategory: ProfessionalCategory.CS3,
          suId: null,
        }),
      ],
    });

    const csv = await buildCSVFromSUAnswers(surveyId);

    expect(csv).toBe(
      [
        "Email,Genre,Age,CSP,SU",
        "first@mail.com,MAN,FROM_15_TO_29,CS3,",
        "second@mail.com,WOMAN,ABOVE_75,CS1,11",
      ].join("\r\n"),
    );
  });
});

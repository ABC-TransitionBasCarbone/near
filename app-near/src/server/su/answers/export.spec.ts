import { db } from "~/server/db";
import { buildCSVFromSUAnswers } from "./export";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { clearAlldata } from "~/server/test-utils/clear";
import { AgeCategory, Gender, ProfessionalCategory } from "@prisma/client";

describe("buildCSVFromSUAnswers", () => {
  const surveyName = "survey-test-export-su";
  let surveyId: number;

  beforeEach(async () => {
    await clearAlldata();
    const survey = await createNeighborhood(surveyName);
    surveyId = survey.id;
  });

  it("should return an empty string when there is no answer", async () => {
    expect(await buildCSVFromSUAnswers(surveyId)).toBe("");
  });

  it("should export only the current survey's SU answers, ordered by id, with the linked SU value", async () => {
    const otherSurvey = await createNeighborhood("survey-test-export-su-other");
    await db.suAnswer.create({
      data: buildSuAnswer(otherSurvey.id, { email: "other@mail.com" }),
    });

    const suBank = await db.suBank.create({
      data: { name: "bank-a", colorMain: "#111111" },
    });
    await db.suData.create({
      data: {
        id: 1,
        surveyId,
        su: 11,
        suBankId: suBank.id,
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
        `second@mail.com,WOMAN,ABOVE_75,CS1,${suBank.name}`,
      ].join("\r\n"),
    );
  });
});

import {
  AgeCategory,
  Gender,
  ProfessionalCategory,
  type Survey,
} from "@prisma/client";
import { db } from "~/server/db";
import { countAnswers, countAnswersByCategories } from "./count";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { clearAlldata } from "~/server/test-utils/clear";
import { CategoryStat } from "~/types/SuAnswer";

describe("count", () => {
  let survey: Survey;
  const surveyName = "survey-test-count";

  beforeEach(async () => {
    await clearAlldata();

    survey = await createNeighborhood(surveyName);
  });

  describe("countAnswers", () => {
    it("should return 0 when no answer is available", async () => {
      const result = await countAnswers(survey.id);

      expect(result).toBe(0);
    });

    it("should return the number of answers for the survey", async () => {
      await db.suAnswer.createMany({
        data: [buildSuAnswer(survey.id), buildSuAnswer(survey.id)],
      });

      const result = await countAnswers(survey.id);

      expect(result).toBe(2);
    });
  });

  describe("countAnswersByCategories", () => {
    it("should return the count of answers grouped by insee category", async () => {
      await db.suAnswer.createMany({
        data: [
          buildSuAnswer(survey.id, {
            ageCategory: AgeCategory.ABOVE_75,
            gender: Gender.MAN,
            professionalCategory: ProfessionalCategory.CS1,
          }),
          buildSuAnswer(survey.id, {
            ageCategory: AgeCategory.ABOVE_75,
            gender: Gender.WOMAN,
            professionalCategory: ProfessionalCategory.CS2,
          }),
          buildSuAnswer(survey.id, {
            ageCategory: AgeCategory.FROM_15_TO_29,
            gender: Gender.OTHER,
            professionalCategory: ProfessionalCategory.CS1,
          }),
        ],
      });

      const result = await countAnswersByCategories(survey.id, "ageCategory");

      expect(result).toStrictEqual({
        [CategoryStat.above_75]: 2,
        [CategoryStat.from_15_to_29]: 1,
      });
    });

    it("should ignore genders with no insee target", async () => {
      await db.suAnswer.createMany({
        data: [
          buildSuAnswer(survey.id, { gender: Gender.MAN }),
          buildSuAnswer(survey.id, { gender: Gender.OTHER }),
        ],
      });

      const result = await countAnswersByCategories(survey.id, "gender");

      expect(result).toStrictEqual({ [CategoryStat.man]: 1 });
    });
  });
});

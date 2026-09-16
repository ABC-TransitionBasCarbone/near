import { ProfessionalCategory, type Survey } from "@prisma/client";
import { db } from "~/server/db";
import { getSuAnswerDistribution } from "./suAnswerDistribution";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { clearAlldata } from "~/server/test-utils/clear";
import { CategoryStat } from "~/types/SuAnswer";

describe("getSuAnswerDistribution", () => {
  let survey: Survey;

  beforeEach(async () => {
    await clearAlldata();
    survey = await createNeighborhood("survey-test-su-answer-distribution");
  });

  describe("SU view", () => {
    it("should collapse every CS8 variant into a single cs8 category", async () => {
      const su = await db.suData.create({
        data: {
          surveyId: survey.id,
          su: 1,
          popPercentage: 100,
          barycenter: {},
        },
      });

      await db.suAnswer.createMany({
        data: [
          buildSuAnswer(survey.id, {
            suId: su.id,
            professionalCategory: ProfessionalCategory.CS8_student,
          }),
          buildSuAnswer(survey.id, {
            suId: su.id,
            professionalCategory: ProfessionalCategory.CS8_unemployed,
          }),
          buildSuAnswer(survey.id, {
            suId: su.id,
            professionalCategory: ProfessionalCategory.CS8_home,
          }),
          buildSuAnswer(survey.id, {
            suId: su.id,
            professionalCategory: ProfessionalCategory.CS1,
          }),
        ],
      });

      const result = await getSuAnswerDistribution(
        survey.id,
        "professionalCategory",
        [1],
      );

      const cs8 = result.data.find((d) => d.category === CategoryStat.cs8);
      const cs1 = result.data.find((d) => d.category === CategoryStat.cs1);

      expect(result.isNeighborhood).toBe(false);
      expect(result.totalResponses).toBe(4);
      expect(cs8?.count).toBe(3);
      expect(cs8?.percentage).toBe(75);
      expect(cs1?.count).toBe(1);
    });
  });

  describe("neighborhood view", () => {
    it("should read the age distribution directly from the seeded Quartier row", async () => {
      // createNeighborhood seeds: 1529=180, 3044=230, 4559=170, 6074=200, 75p=220 (total 1000)
      const result = await getSuAnswerDistribution(survey.id, "ageCategory");

      expect(result.isNeighborhood).toBe(true);
      expect(result.totalResponses).toBe(1000);
      expect(
        result.data.find((d) => d.category === CategoryStat.from_15_to_29)
          ?.count,
      ).toBe(180);
      expect(
        result.data.find((d) => d.category === CategoryStat.above_75)
          ?.percentage,
      ).toBe(22);
    });
  });
});

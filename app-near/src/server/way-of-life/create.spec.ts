import { type SuData, type Survey } from "@prisma/client";
import { handleWayOfLifeCreation } from "./create";
import { clearAlldata } from "../test-utils/clear";
import { db } from "../db";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";

describe("create", () => {
  describe("handleWayOfLifeCreation", () => {
    const neighborhoodName = "neighborhood_test";
    let survey: Survey;
    const knownSu = 3;
    let knownSuData: SuData;

    beforeEach(async () => {
      await clearAlldata();

      survey = await db.survey.create({
        data: { name: neighborhoodName },
      });

      knownSuData = await db.suData.create({
        data: {
          barycenter: [1, 2, 3, 4],
          popPercentage: 0.3,
          su: knownSu,
          surveyId: survey.id,
        },
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("should create data without email", async () => {
      await handleWayOfLifeCreation(
        buildWayOfLifeAnswer(survey.id, {
          email: undefined,
          knowSu: true,
          suId: knownSuData.id,
        }),
        survey,
      );

      const createdData = await db.wayOfLifeAnswer.findMany();

      expect(createdData.length).toBe(1);
      expect(createdData[0]?.suId).toBe(knownSuData.id);
    });

    it("should create data with email", async () => {
      await handleWayOfLifeCreation(
        buildWayOfLifeAnswer(survey.id, {
          email: "test@mail.com",
          knowSu: true,
          suId: knownSuData.id,
        }),
        survey,
      );

      const createdData = await db.wayOfLifeAnswer.findMany();

      expect(createdData.length).toBe(1);
      expect(createdData[0]?.suId).toBe(knownSuData.id);
    });
  });
});

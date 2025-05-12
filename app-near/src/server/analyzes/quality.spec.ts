import { TRPCError } from "@trpc/server";
import { getAllQualityStatistics } from "./quality";
import { ErrorCode } from "~/types/enums/error";
import { db } from "../db";
import { createNeighborhood } from "../test-utils/create-data/neighborhood";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { type CarbonFootprintAnswer, type Survey } from "@prisma/client";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";
import { buildCarbonFootprintAnswer } from "../test-utils/create-data/carbonFootprintAnswer";
import { clearAllSurveys } from "../test-utils/clear/survey";

describe("quality", () => {
  describe("getAllQualityStatistics", () => {
    let survey: Survey;
    const surveyName = "test-getAllQualityStatistics";
    const suId = 2;

    beforeEach(async () => {
      await clearAllSurveys();

      survey = await createNeighborhood(surveyName);
      await db.suData.create({
        data: {
          id: suId,
          barycenter: 0.1,
          popPercentage: 0.11,
          su: 11,
          surveyId: survey.id,
        },
      });

      await db.suAnswer.createMany({
        data: Array.from(Array(10).keys()).map(() => buildSuAnswer(survey.id)),
      });
      await db.wayOfLifeAnswer.createMany({
        data: Array.from(Array(20).keys()).map(() =>
          buildWayOfLifeAnswer(survey.id),
        ),
      });
      await db.carbonFootprintAnswer.createMany({
        // @ts-expect-error unexpecte typescript error for answers
        data: Array.from(Array(30).keys()).map(
          () =>
            buildCarbonFootprintAnswer(survey.id, {
              suId,
            }) as CarbonFootprintAnswer,
        ),
      });
    });

    it("should throw 404 when neighorhood is not found", async () => {
      expect.assertions(2);
      try {
        await getAllQualityStatistics(32313131);
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("NOT_FOUND");
          expect(error.message).toBe(ErrorCode.NEIGHBORHOOD_NOT_FOUND);
        }
      }
    });

    it("should return quality statistices", async () => {
      const result = await getAllQualityStatistics(survey.id);

      expect(result).toMatchSnapshot();
    });
  });
});

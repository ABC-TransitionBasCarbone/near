import { type SuData, type Survey } from "@prisma/client";
import { handleWayOfLifeCreation } from "./create";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { db } from "../db";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";
import EmailService from "../email";
import { TemplateId } from "~/types/enums/brevo";

describe("create", () => {
  describe("handleWayOfLifeCreation", () => {
    const neighborhoodName = "neighborhood_test";
    let survey: Survey;
    const knownSu = 3;
    let knownSuData: SuData;

    let sendEmailMock: jest.SpyInstance;

    beforeEach(async () => {
      await clearAllSurveys();

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

      sendEmailMock = jest
        .spyOn(EmailService, "sendEmail")
        .mockReturnValue(Promise.resolve("send"));
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

      expect(sendEmailMock).not.toHaveBeenCalled();
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

      expect(sendEmailMock).toHaveBeenCalledWith({
        params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
        templateId: TemplateId.PHASE_2_NOTIFICATION,
        to: [{ email: "test@mail.com" }],
      });
    });
  });
});

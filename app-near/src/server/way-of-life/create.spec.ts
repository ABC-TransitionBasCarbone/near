/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AirTravelFrequency,
  DigitalIntensity,
  HeatSource,
  MeatFrequency,
  PurchasingStrategy,
  type SuData,
  type Survey,
  TransportationMode,
  YesNo,
} from "@prisma/client";
import { handleWayOfLifeCreation } from "./create";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { db } from "../db";
import { ZodError } from "zod";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import apiSuService from "../external-api/api-su";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";
import EmailService from "../email";
import { TemplateId } from "~/types/enums/brevo";

describe("create", () => {
  describe("handleWayOfLifeCreation", () => {
    const neighborhoodName = "neighborhood_test";
    let survey: Survey;
    const knownSu = 3;
    const unknownSu = 4;
    let knownSuData: SuData;
    let unknownSuData: SuData;

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

      unknownSuData = await db.suData.create({
        data: {
          barycenter: [1, 2, 3, 4],
          popPercentage: 0.3,
          su: unknownSu,
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

    it("should throw error when no su found", async () => {
      await db.suData.deleteMany();

      expect.assertions(2);

      try {
        await handleWayOfLifeCreation(
          // @ts-expect-error allow for test
          {
            airTravelFrequency: AirTravelFrequency.ABOVE_3,
            digitalIntensity: DigitalIntensity.LIGHT,
            heatSource: HeatSource.OIL,
            meatFrequency: MeatFrequency.MAJOR,
            purchasingStrategy: PurchasingStrategy.NEW,
            transportationMode: TransportationMode.PUBLIC,
          },
          survey,
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("NOT_FOUND");
          expect(error.message).toBe(ErrorCode.SU_NOT_FOUND);
        }
      }
    });

    it("should throw error when wrong payload", async () => {
      expect.assertions(1);

      try {
        await handleWayOfLifeCreation(
          // @ts-expect-error allow for test
          {
            accessToFoodServiceSatisfaction: YesNo.DONT_KNOW,
          },
          survey,
        );
      } catch (error) {
        if (error instanceof ZodError) {
          expect(JSON.stringify(error)).toMatch(/invalid_type/);
        }
      }
    });

    it("should throw error when returned su not found", async () => {
      expect.assertions(2);
      jest.spyOn(apiSuService, "assignSu").mockReturnValue(
        Promise.resolve({
          distanceToBarycenter: 1234,
          su: 19,
        }),
      );

      try {
        await handleWayOfLifeCreation(
          // @ts-expect-error allow for test
          {
            airTravelFrequency: AirTravelFrequency.ABOVE_3,
            digitalIntensity: DigitalIntensity.LIGHT,
            heatSource: HeatSource.OIL,
            meatFrequency: MeatFrequency.MAJOR,
            purchasingStrategy: PurchasingStrategy.NEW,
            transportationMode: TransportationMode.PUBLIC,
          },
          survey,
        );
      } catch (error) {
        if (error instanceof TRPCError) {
          expect(error.code).toBe("NOT_FOUND");
          expect(error.message).toBe(ErrorCode.SU_NOT_FOUND);
        }
      }
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

    it("should create data when unknown su", async () => {
      jest.spyOn(apiSuService, "assignSu").mockReturnValue(
        Promise.resolve({
          distanceToBarycenter: 1234,
          su: unknownSu,
        }),
      );

      await handleWayOfLifeCreation(
        buildWayOfLifeAnswer(survey.id, {
          email: "test@mail.com",
          knowSu: false,
          suId: undefined,
        }),
        survey,
      );

      const createdData = await db.wayOfLifeAnswer.findMany();

      expect(createdData.length).toBe(1);
      expect(createdData[0]?.suId).toBe(unknownSuData.id);

      expect(sendEmailMock).toHaveBeenCalledWith({
        params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
        templateId: TemplateId.PHASE_2_NOTIFICATION,
        to: [{ email: "test@mail.com" }],
      });
    });
  });
});

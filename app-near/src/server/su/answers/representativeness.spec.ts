import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
  Gender,
  HeatSource,
  MeatFrequency,
  ProfessionalCategory,
  PurchasingStrategy,
  type Survey,
  TransportationMode,
} from "@prisma/client";
import { db } from "~/server/db";
import representativenessService from "./representativeness";
import { TRPCError } from "@trpc/server";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";

describe("representativeness", () => {
  let survey: Survey;
  const surveyName = "survey-test-representativeness";

  beforeEach(async () => {
    await db.suAnswer.deleteMany().catch(() => null);
    await db.suData.deleteMany().catch(() => null);
    await db.survey.delete({ where: { name: surveyName } }).catch(() => null);

    survey = await createNeighborhood(surveyName);
  });

  it("should return null when no answer is available", async () => {
    const result = await representativenessService.representativeness(
      survey.id,
    );

    expect(result).toBe(null);
  });

  it("should throw error when surveyId is not found", async () => {
    expect.assertions(2);
    try {
      await representativenessService.representativeness(7895);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("NOT_FOUND");
        expect(error.message).toBe("survey 7895 not found");
      }
    }
  });

  it("should return representativeness when answers quantity is below sampleTarget", async () => {
    await db.suAnswer.createMany({
      data: [
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.MAN,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.OTHER,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
      ],
    });

    const result = await representativenessService.representativeness(
      survey.id,
    );

    expect(result).toMatchSnapshot();
  });

  it("should return representativeness when answers quantity is above sampleTarget", async () => {
    await db.suAnswer.createMany({
      data: [
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.MAN,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.MAN,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.MAN,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
        {
          ageCategory: AgeCategory.ABOVE_75,
          airTravelFrequency: AirTravelFrequency.ABOVE_3,
          broadcastChannel: "mail_campaign",
          digitalIntensity: DigitalIntensity.INTENSE,
          easyHealthAccess: EasyHealthAccess.EASY,
          gender: Gender.OTHER,
          heatSource: HeatSource.ELECTRICITY,
          meatFrequency: MeatFrequency.MAJOR,
          professionalCategory: ProfessionalCategory.CS1,
          purchasingStrategy: PurchasingStrategy.MIXED,
          transportationMode: TransportationMode.CAR,
          surveyId: survey.id,
        },
      ],
    });

    const result = await representativenessService.representativeness(
      survey.id,
    );

    expect(result).toMatchSnapshot();
  });
});

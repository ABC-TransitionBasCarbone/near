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
  SurveyPhase,
  TransportationMode,
} from "@prisma/client";
import { db } from "~/server/db";
import targetService from "~/server/neighborhoods/targets";
import { CategoryStat } from "~/types/SuAnswer";
import representativenessService from "./representativeness";
import { TRPCError } from "@trpc/server";

describe("representativeness", () => {
  let survey: Survey;
  const surveyName = "survey-test-representativeness";
  beforeAll(async () => {
    await db.$executeRawUnsafe(`CREATE OR REPLACE VIEW quartiers AS
      SELECT 
        0 AS A,
        0 AS B;`);
  });
  beforeEach(async () => {
    jest.spyOn(targetService, "getInseeTargetsByCategories").mockReturnValue(
      Promise.resolve({
        [CategoryStat.cs1]: 0.22,
        [CategoryStat.cs2]: 0.11,
        [CategoryStat.cs3]: 0.18,
        [CategoryStat.cs4]: 0.15,
        [CategoryStat.cs5]: 0.05,
        [CategoryStat.cs6]: 0.12,
        [CategoryStat.cs7]: 0.08,
        [CategoryStat.cs8]: 0.09,
        [CategoryStat.above_75]: 0.22,
        [CategoryStat.from_15_to_29]: 0.18,
        [CategoryStat.from_30_to_44]: 0.23,
        [CategoryStat.from_45_to_59]: 0.17,
        [CategoryStat.from_60_to_74]: 0.2,
        [CategoryStat.man]: 0.44,
        [CategoryStat.woman]: 0.56,
      }),
    );

    await db.suAnswer.deleteMany().catch(() => null);
    await db.survey.delete({ where: { name: surveyName } }).catch(() => null);
    survey = await db.survey.create({
      data: {
        name: surveyName,
        phase: SurveyPhase.STEP_2_SU_SURVERY,
        sampleTarget: 2,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
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

  it("should return representativeness when answers quantity is bellow sampleTarget", async () => {
    await db.suAnswer.create({
      data: {
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
      ],
    });

    const result = await representativenessService.representativeness(
      survey.id,
    );

    expect(result).toMatchSnapshot();
  });
});

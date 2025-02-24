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
import representativenessService from "./representativeness";
import { TRPCError } from "@trpc/server";

describe("representativeness", () => {
  let survey: Survey;
  const surveyName = "survey-test-representativeness";

  beforeEach(async () => {
    await db.suAnswer.deleteMany().catch(() => null);
    await db.survey.delete({ where: { name: surveyName } }).catch(() => null);
    survey = await db.survey.create({
      data: {
        name: surveyName,
        phase: SurveyPhase.STEP_2_SU_SURVERY,
        sampleTarget: 2,
      },
    });
    await db.$queryRaw`CREATE OR REPLACE VIEW quartiers AS
      SELECT 
        ${survey.id} AS survey_id,
        ARRAY['75014', '75015', '75016']::text[] AS iris_selectors,
        1000 AS population_sum,
        180 AS p21_pop1529_sum,
        230 AS p21_pop3044_sum,
        170 AS p21_pop4559_sum,
        200 AS p21_pop6074_sum,
        220 AS p21_pop75p_sum,
        220 AS c21_pop15p_cs1_sum,
        110 AS c21_pop15p_cs2_sum,
        180 AS c21_pop15p_cs3_sum,
        150 AS c21_pop15p_cs4_sum,
        50 AS c21_pop15p_cs5_sum,
        120 AS c21_pop15p_cs6_sum,
        80 AS c21_pop15p_cs7_sum,
        90 AS c21_pop15p_cs8_sum,
        560 AS population_femme_sum,
        440 AS population_homme_sum,
        0 AS population_sum_threshold_3p,
        0 AS population_sum_threshold_4p,
        0 AS population_sum_threshold_4_5p,
        0 AS population_sum_threshold_5p
        ;`;
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

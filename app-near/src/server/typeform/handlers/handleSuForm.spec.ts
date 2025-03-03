import {
  AgeCategory,
  AirTravelFrequency,
  BroadcastChannel,
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
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { handleSuForm } from "./handleSuForm";
import { env } from "~/env";

describe("", () => {
  const neighborhoodName = "neighborhood_test";
  let survey: Survey;

  beforeEach(async () => {
    await db.suAnswer.deleteMany();
    await db.suData.deleteMany();
    await db.survey.deleteMany();
    survey = await db.survey.create({
      data: { name: neighborhoodName },
    });
  });

  it("should return 404 when no survey found by name", async () => {
    // Act
    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      "unknown",
      BroadcastChannel.mail_campaign,
    );

    // Assert
    expect(response.status).toBe(404);
    expect(await response.text()).toContain(`Survey name unknown not found`);
  });

  it("should return 400 when neighborhood is not defined", async () => {
    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      "",
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Survey name not found");
  });

  it("should return 200 when user as less than 15", async () => {
    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: "wrong",
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("user should be under 15");
  });

  it(`should return 200 when not in ${SurveyPhase.STEP_2_SU_SURVERY}`, async () => {
    // Arrange
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_3_SU_EXPLORATION },
      where: { name: neighborhoodName },
    });

    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );

    // Assert
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(
      `step ${SurveyPhase.STEP_2_SU_SURVERY} is over for ${neighborhoodName}`,
    );
  });

  it("should return 200 when user is not resident", async () => {
    const response = await handleSuForm(
      {
        isNeighborhoodResident: false,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("user should live in neighborhood");
  });

  it("should return 201", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_2_SU_SURVERY },
      where: { name: neighborhoodName },
    });

    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
        email: "test@mail.com",
      },
      env.SU_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
  });

  it("should return 201 when email is empty and empty email already exist", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_2_SU_SURVERY },
      where: { name: neighborhoodName },
    });

    await db.suAnswer.createMany({
      data: [
        buildSuAnswer(survey.id),
        buildSuAnswer(survey.id, { email: null }),
        buildSuAnswer(survey.id, { email: "" }),
        buildSuAnswer(survey.id, { email: undefined }),
      ],
    });

    const response = await handleSuForm(
      {
        isNeighborhoodResident: true,
        ageCategory: AgeCategory.FROM_15_TO_29,
        airTravelFrequency: AirTravelFrequency.ABOVE_3,
        digitalIntensity: DigitalIntensity.INTENSE,
        easyHealthAccess: EasyHealthAccess.EASY,
        gender: Gender.MAN,
        heatSource: HeatSource.ELECTRICITY,
        meatFrequency: MeatFrequency.MAJOR,
        professionalCategory: ProfessionalCategory.CS1,
        purchasingStrategy: PurchasingStrategy.MIXED,
        transportationMode: TransportationMode.CAR,
      },
      env.SU_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
  });
});

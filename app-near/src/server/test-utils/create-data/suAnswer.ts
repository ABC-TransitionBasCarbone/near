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
  ProfessionalSituation,
  PurchasingStrategy,
  type SuAnswer,
  TransportationMode,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type BuilderSuAnswer } from "~/types/SuAnswer";

export const buildSuAnswer = (
  surveyId: number,
  data?: Partial<SuAnswer>,
): BuilderSuAnswer => {
  const professionalSituation =
    data?.professionalSituation ??
    faker.helpers.arrayElement(Object.values(ProfessionalSituation));

  return {
    suId: null,
    emailApiCalled: false,
    ageCategory: faker.helpers.arrayElement(Object.values(AgeCategory)),
    airTravelFrequency: faker.helpers.arrayElement(
      Object.values(AirTravelFrequency),
    ),
    broadcastChannel: faker.helpers.arrayElement(
      Object.values(BroadcastChannel),
    ),
    digitalIntensity: faker.helpers.arrayElement(
      Object.values(DigitalIntensity),
    ),
    easyHealthAccess: faker.helpers.arrayElement(
      Object.values(EasyHealthAccess),
    ),
    email: Date.now() + faker.internet.email(),
    gender: faker.helpers.arrayElement(Object.values(Gender)),
    heatSource: faker.helpers.arrayElement(Object.values(HeatSource)),
    meatFrequency: faker.helpers.arrayElement(Object.values(MeatFrequency)),
    professionalSituation,
    professionalCategory:
      professionalSituation === ProfessionalSituation.EMPLOYEE
        ? faker.helpers.arrayElement([
            ProfessionalCategory.CS1,
            ProfessionalCategory.CS2,
            ProfessionalCategory.CS3,
            ProfessionalCategory.CS4,
            ProfessionalCategory.CS5,
            ProfessionalCategory.CS6,
          ])
        : null,
    purchasingStrategy: faker.helpers.arrayElement(
      Object.values(PurchasingStrategy),
    ),
    transportationMode: faker.helpers.arrayElement(
      Object.values(TransportationMode),
    ),
    broadcastId: faker.string.uuid(),
    typeformId: faker.string.uuid(),
    ...data,
    surveyId,
  };
};

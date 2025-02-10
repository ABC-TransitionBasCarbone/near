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
  TransportationMode,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type BuilderSuAnswer } from "~/types/SuAnswer";

export const buildSuAnswer = (surveyId: number): BuilderSuAnswer => ({
  isNeighborhoodResident: faker.datatype.boolean(),
  ageCategory: faker.helpers.arrayElement(Object.values(AgeCategory)),
  airTravelFrequency: faker.helpers.arrayElement(
    Object.values(AirTravelFrequency),
  ),
  broadcastChannel: faker.helpers.arrayElement(Object.values(BroadcastChannel)),
  digitalIntensity: faker.helpers.arrayElement(Object.values(DigitalIntensity)),
  easyHealthAccess: faker.helpers.arrayElement(Object.values(EasyHealthAccess)),
  email: faker.internet.email(),
  gender: faker.helpers.arrayElement(Object.values(Gender)),
  heatSource: faker.helpers.arrayElement(Object.values(HeatSource)),
  meatFrequency: faker.helpers.arrayElement(Object.values(MeatFrequency)),
  professionalCategory: faker.helpers.arrayElement(
    Object.values(ProfessionalCategory),
  ),
  purchasingStrategy: faker.helpers.arrayElement(
    Object.values(PurchasingStrategy),
  ),
  transportationMode: faker.helpers.arrayElement(
    Object.values(TransportationMode),
  ),
  surveyId,
});

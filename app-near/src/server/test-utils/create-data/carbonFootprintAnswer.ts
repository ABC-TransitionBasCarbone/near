import { BroadcastChannel, type CarbonFootprintAnswer } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type BuilderCarbonFootprintAnswer } from "~/types/CarbonFootprint";

export const buildCarbonFootprintAnswer = (
  surveyId: number,
  data?: Partial<CarbonFootprintAnswer>,
): BuilderCarbonFootprintAnswer => ({
  emailApiCalled: false,
  broadcastChannel: faker.helpers.arrayElement(Object.values(BroadcastChannel)),
  email: Date.now() + faker.internet.email(),
  ...data,
  surveyId,
});

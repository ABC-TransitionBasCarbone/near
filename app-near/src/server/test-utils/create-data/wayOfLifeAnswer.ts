import { BroadcastChannel, type WayOfLifeAnswer } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { type BuilderWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

export const buildWayOfLifeAnswer = (
  surveyId: number,
  data?: Partial<WayOfLifeAnswer>,
): BuilderWayOfLifeAnswer => ({
  emailApiCalled: false,
  broadcastChannel: faker.helpers.arrayElement(Object.values(BroadcastChannel)),
  email: Date.now() + faker.internet.email(),
  ...data,
  surveyId,
});

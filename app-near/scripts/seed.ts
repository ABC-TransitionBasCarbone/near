/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
  BroadcastChannel,
  Gender,
  HeatSource,
  MeatFrequency,
  PrismaClient,
  ProfessionalCategory,
  PurchasingStrategy,
  TransportationMode,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const getRandomEnum = <T extends object>(enumObj: T): T[keyof T] => {
  const values = Object.values(enumObj);
  return values[Math.floor(Math.random() * values.length)] as T[keyof T];
};

async function main() {
  console.log("Seeding database...");

  for (let i = 0; i < 400; i++) {
    // Générer 500 lignes
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await prisma.suAnswer.create({
      data: {
        isNeighborhoodResident: faker.datatype.boolean(),
        ageCategory: getRandomEnum(AgeCategory),
        gender: getRandomEnum(Gender),
        professionalCategory: getRandomEnum(ProfessionalCategory),
        easyHealthAccess: getRandomEnum(EasyHealthAccess),
        meatFrequency: getRandomEnum(MeatFrequency),
        transportationMode: getRandomEnum(TransportationMode),
        digitalIntensity: getRandomEnum(DigitalIntensity),
        purchasingStrategy: getRandomEnum(PurchasingStrategy),
        airTravelFrequency: getRandomEnum(AirTravelFrequency),
        heatSource: getRandomEnum(HeatSource),
        email: faker.internet.email(),
        broadcastChannel: getRandomEnum(BroadcastChannel),
        surveyId: 1,
      },
    });
  }

  console.log("Seeding completed!");
}

main().catch((e) => {
  console.error("Seeding error:", e);
  process.exit(1);
});

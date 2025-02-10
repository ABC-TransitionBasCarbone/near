import { PrismaClient } from "@prisma/client";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";

const prisma = new PrismaClient();

const seedSuSurvey = async () => {
  await Promise.all(
    Array.from({ length: 5 }, (el, index) => index).map(() => {
      return prisma.suAnswer.create({
        data: buildSuAnswer(1),
      });
    }),
  );
};

const args = process.argv.slice(2);

await seedSuSurvey()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .then(() => {
    console.log("end");
    process.exit(0);
  });

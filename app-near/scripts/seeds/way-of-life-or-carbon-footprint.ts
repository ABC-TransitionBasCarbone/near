import { faker } from "@faker-js/faker";
import { db } from "~/server/db";
import { buildWayOfLifeAnswer } from "~/server/test-utils/create-data/wayOfLifeAnswer";
import { SeedScope } from ".";

export const seedWayOfLifeOrCarbonFootprintSurvey = async (
  surveyName: string | undefined,
  quantity: number | undefined,
  type: SeedScope,
) => {
  const dbObject =
    type === SeedScope.CARBON_FOOTPRINT_ANSWER
      ? db.carbonFootprintAnswer
      : db.wayOfLifeAnswer;

  if (!surveyName || !quantity) {
    throw new Error(`
surveyName (${surveyName}) or quantity (${quantity}) not defined. 

Usages:
  - npm run seed -- scope=way_of_life_answer surveyName="Porte d'Orléans" quantity=90
  - npm run seed -- scope=carbon_footprint_answer surveyName="Porte d'Orléans" quantity=90
`);
  }

  const survey = await db.survey.findUnique({
    where: { name: surveyName },
    include: { quartier: true },
  });

  if (!survey) {
    const existingSurveys = await db.survey.findMany({
      select: { name: true },
    });
    throw new Error(`

Usages:
  - npm run seed -- scope=way_of_life_answer surveyName="Porte d'Orléans" quantity=90
  - npm run seed -- scope=carbon_footprint_answer surveyName="Porte d'Orléans" quantity=90

Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
    `);
  }

  if (!survey.quartier) {
    throw new Error('Can not use "survey" that has null "quartier".');
  }

  const su = await db.suData.findMany({ where: { surveyId: survey.id } });

  if (!su || su.length === 0) {
    throw new Error(`
You should first generate su data using user interface.
      `);
  }

  const suIds = su.map((item) => item.id);

  //@ts-expect-error typescript detection
  await dbObject.deleteMany({
    where: { surveyId: survey.id },
  });

  for (let index = 0; index < quantity; index++) {
    //@ts-expect-error typescript detection
    await dbObject.create({
      data: buildWayOfLifeAnswer(survey.id, {
        suId: faker.helpers.arrayElement(suIds),
      }),
    });
  }
};

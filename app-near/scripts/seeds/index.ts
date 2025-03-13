import "dotenv/config";
import { env } from "~/env";
import { seedSuSurvey, type SurveyCase } from "./su";
import { seedWayOfLifeOrCarbonFootprintSurvey } from "./way-of-life-or-carbon-footprint";

export enum SeedScope {
  SU_ANSWER = "su_answer",
  WAY_OF_LIFE_ANSWER = "way_of_life_answer",
  CARBON_FOOTPRINT_ANSWER = "carbon_footprint_answer",
}

const parseArgs = () => {
  const rawArgs = process.argv.slice(2);
  const args: Record<string, string | boolean> = {};

  rawArgs.forEach((arg) => {
    if (arg.includes("=")) {
      const [key, value] = arg.split("=");
      if (key && value !== undefined) args[key] = value;
    }
  });

  return args;
};

const args = parseArgs();

const seed = async () => {
  if (env.NODE_ENV === "production") {
    throw new Error("Can not seed on production environment");
  }

  const seedScope = args.scope as SeedScope | undefined;

  if (!seedScope || !Object.values(SeedScope).includes(seedScope)) {
    throw new Error(`
You should select a valid scope. Valid values are: ${Object.values(SeedScope).join(", ")}

Usages: 
  - npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_TARGET
  - npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=MORE_THAN_GLOBAL_TARGET
  - npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=MORE_THAN_CATEGORIES_TARGETS
  - npm run seed -- scope=way_of_life_answer surveyName="Porte d'Orléans" quantity=90
  - npm run seed -- scope=carbon_footprint_answer surveyName="Porte d'Orléans" quantity=90
      `);
  }

  if (seedScope === SeedScope.SU_ANSWER) {
    const surveyName = args.surveyName as string | undefined;
    const surveyTarget = parseInt(args.surveyTarget as string, 10);
    const surveyCase = args.surveyCase as SurveyCase | undefined;

    await seedSuSurvey(surveyName, surveyTarget, surveyCase);
  }

  if (
    [SeedScope.CARBON_FOOTPRINT_ANSWER, SeedScope.WAY_OF_LIFE_ANSWER].includes(
      seedScope,
    )
  ) {
    const surveyName = args.surveyName as string | undefined;
    const quantity = parseInt(args.quantity as string, 10);

    await seedWayOfLifeOrCarbonFootprintSurvey(surveyName, quantity, seedScope);
  }
};

await seed()
  .catch((e) => {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    process.exit(1);
  })
  .then(() => {
    console.log("End seed successfully");
    process.exit(0);
  });

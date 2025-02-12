import "dotenv/config";
import { env } from "~/env";
import { seedSuSurvey, type SurveyCase } from "./su";

enum SeedScope {
  SU_ANSWER = "su_answer",
  ALL = "all",
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

Usage: npm run seed -- scope=su_answer
      `);
  }

  if (seedScope === SeedScope.SU_ANSWER) {
    const surveyName = args.surveyName as string | undefined;
    const surveyTarget = parseInt(args.surveyTarget as string, 10);
    const surveyCase = args.surveyCase as SurveyCase | undefined;

    await seedSuSurvey(surveyName, surveyTarget, surveyCase);
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

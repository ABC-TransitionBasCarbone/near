import { parseArgs } from "scripts/utils";
import { createSurvey } from "~/server/surveys/create";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages: 
  - npm run user:create -- iris=<iris1,iris2> surveyName=<surveyName> [--standalone]
`);
};

const createSurveyScript = async () => {
  const { iris, surveyName } = parseArgs() as {
    iris?: string;
    surveyName?: string;
  };

  if (!iris || !surveyName) {
    throw new Error("Verify usage command: iris or surveyName is missing");
  }

  const irisList = iris.split(",");

  await createSurvey(surveyName, irisList);
};

try {
  await createSurveyScript();
  console.log("End create survey successfully");
} catch (e) {
  if (e instanceof Error) {
    endProcess(e.message);
  } else {
    endProcess("unknown error");
  }
}

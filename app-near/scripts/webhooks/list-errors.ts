import { type AnswerType } from "@prisma/client";
import { parseArgs } from "scripts/utils";
import { listActiveAnswerErrors } from "~/server/anwser-error/list";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages:
  - npm run webhooks:list-errors -- [type=SU|WAY_OF_LIFE|CARBON_FOOTPRINT]
`);
};

const listErrors = async () => {
  const { type } = parseArgs() as { type?: AnswerType };

  const errors = await listActiveAnswerErrors(type);

  if (errors.length === 0) {
    console.log("No active answer error");
    return;
  }

  console.table(
    errors.map((error) => ({
      id: error.id,
      answerType: error.answerType,
      retryCount: error.retryCount,
      lastAttemptAt: error.lastAttemptAt?.toISOString() ?? "-",
      errorMessage: error.errorMessage ?? "-",
    })),
  );
};

try {
  await listErrors();
} catch (e) {
  if (e instanceof Error) {
    endProcess(e.message);
  } else {
    endProcess("unknown error");
  }
}

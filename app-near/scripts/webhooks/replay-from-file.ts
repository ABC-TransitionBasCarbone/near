import { existsSync, readFileSync, writeFileSync } from "fs";
import { AnswerType } from "@prisma/client";
import { parseArgs } from "scripts/utils";
import { type RecoveredPayloadRecord } from "./recover-from-logs";
import { replayPayload } from "./replay";

const endProcess = (message: string) => {
  console.error(`
${message}

Usages:
  - npm run webhooks:replay-from-file -- file=<path> id=<id>
  - npm run webhooks:replay-from-file -- file=<path> all=true
  - npm run webhooks:replay-from-file -- file=<path> surveyName=<surveyName>
`);
};

type ReplayFromFileArgs = {
  file?: string;
  id?: string;
  all?: string;
  type?: string;
  surveyName?: string;
};

const readRecords = (file: string): RecoveredPayloadRecord[] => {
  if (!existsSync(file)) {
    throw new Error(`File not found: ${file}`);
  }
  return JSON.parse(readFileSync(file, "utf-8")) as RecoveredPayloadRecord[];
};

export const selectRecordsToReplay = (
  records: RecoveredPayloadRecord[],
  args: ReplayFromFileArgs,
): RecoveredPayloadRecord[] => {
  const { id, all, type, surveyName } = args;

  if (!id && all !== "true" && !surveyName) {
    throw new Error(
      "Verify usage command: id, all=true or surveyName is missing",
    );
  }

  if (type && type !== AnswerType.SU) {
    throw new Error(
      `This recovery pipeline only ever produced SU payloads, got type=${type}`,
    );
  }

  if (surveyName) {
    const validSurveyNames = [
      ...new Set(records.map((record) => record.surveyName)),
    ].sort();
    if (!validSurveyNames.includes(surveyName)) {
      throw new Error(
        `Survey "${surveyName}" not found in file. Valid survey names: ${validSurveyNames.join(", ")}`,
      );
    }
  }

  return records
    .filter((record) => record.status === "ACTIVE")
    .filter((record) => !id || record.id === Number(id))
    .filter((record) => !surveyName || record.surveyName === surveyName);
};

type ReplayOutcome = "RESOLVED" | "BLOCKED" | "ACTIVE";

const replayRecord = async (
  record: RecoveredPayloadRecord,
): Promise<ReplayOutcome> => {
  const result = await replayPayload(record.payload, AnswerType.SU);
  record.retryCount += 1;

  if (result.status === 201) {
    record.status = "RESOLVED";
    record.errorMessage = null;
    record.resolvedAt = new Date().toISOString();
    console.log(`[replay-from-file] id=${record.id} resolved (status 201)`);
    return "RESOLVED";
  }

  if (result.status === 200) {
    // handleTypeformAnswer only ever returns 201 for a genuine SU creation: a 200 here
    // means the submission was declined again (most likely the survey has since moved
    // past a valid SU phase). Flag it distinctly instead of reporting it as resolved.
    record.status = "BLOCKED";
    record.errorMessage = result.text;
    console.log(
      `[replay-from-file] id=${record.id} blocked (status 200): ${result.text}`,
    );
    return "BLOCKED";
  }

  record.status = "ACTIVE";
  record.errorMessage = result.text;
  console.log(
    `[replay-from-file] id=${record.id} still failing (status ${result.status}): ${result.text}`,
  );
  return "ACTIVE";
};

export const replayFromFile = async (
  args: ReplayFromFileArgs = parseArgs() as ReplayFromFileArgs,
) => {
  const { file } = args;
  if (!file) {
    throw new Error("Verify usage command: file is missing");
  }

  const records = readRecords(file);
  const toReplay = selectRecordsToReplay(records, args);

  if (toReplay.length === 0) {
    console.log("Nothing to replay (not found, already resolved, or blocked)");
    return;
  }

  let resolved = 0;
  let blocked = 0;
  for (const record of toReplay) {
    const outcome = await replayRecord(record);
    if (outcome === "RESOLVED") resolved++;
    if (outcome === "BLOCKED") blocked++;
  }

  writeFileSync(file, JSON.stringify(records, null, 2));

  console.log(
    `Replayed ${toReplay.length} payload(s), ${resolved} resolved, ${blocked} still blocked (needs manual check).`,
  );
};

try {
  await replayFromFile();

  console.log("End replay successfully");
} catch (e) {
  if (e instanceof Error) {
    endProcess(e.message);
  } else {
    endProcess("unknown error");
  }
}

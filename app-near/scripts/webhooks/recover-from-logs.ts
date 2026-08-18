import { readFileSync, writeFileSync, existsSync } from "fs";
import { parseArgs } from "scripts/utils";
import { type TypeformWebhookPayload } from "~/types/Typeform";
import { parseLostSuPayloads } from "./logs/parseLostSuPayloads";

const DEFAULT_OUT = "scripts/webhooks/recovered-su-payloads.json";

const endProcess = (message: string) => {
  console.error(`
${message}

Usage:
  - npm run webhooks:recover-from-logs -- file=<path to logs-app.log> [out=<path to output json, default ${DEFAULT_OUT}>]
`);
};

export type RecoveredPayloadRecord = {
  id: number;
  surveyName: string;
  phase: string;
  capturedAt: string;
  status: "ACTIVE" | "RESOLVED" | "BLOCKED";
  retryCount: number;
  errorMessage: string | null;
  resolvedAt: string | null;
  payload: TypeformWebhookPayload;
};

const readExistingRecords = (out: string): RecoveredPayloadRecord[] => {
  if (!existsSync(out)) return [];
  return JSON.parse(readFileSync(out, "utf-8")) as RecoveredPayloadRecord[];
};

export const recoverFromLogs = async (
  args: { file?: string; out?: string } = parseArgs() as {
    file?: string;
    out?: string;
  },
) => {
  const { file, out = DEFAULT_OUT } = args;

  if (!file) {
    throw new Error("Verify usage command: file is missing");
  }
  if (!existsSync(file)) {
    throw new Error(`Log file not found: ${file}`);
  }

  const { recovered, unmatched } = parseLostSuPayloads(
    readFileSync(file, "utf-8"),
  );

  const existingRecords = readExistingRecords(out);
  const knownTokens = new Set(
    existingRecords.map((record) => record.payload.form_response.token),
  );
  let nextId =
    existingRecords.reduce((max, record) => Math.max(max, record.id), 0) + 1;

  const newRecords: RecoveredPayloadRecord[] = [];
  for (const entry of recovered) {
    if (knownTokens.has(entry.payload.form_response.token)) continue;

    newRecords.push({
      id: nextId++,
      surveyName: entry.surveyName,
      phase: entry.phase,
      capturedAt: new Date().toISOString(),
      status: "ACTIVE",
      retryCount: 0,
      errorMessage: null,
      resolvedAt: null,
      payload: entry.payload,
    });
  }

  writeFileSync(
    out,
    JSON.stringify([...existingRecords, ...newRecords], null, 2),
  );

  console.log(
    `Found ${recovered.length + unmatched.length} notification(s): ${recovered.length} correlated to a raw payload, ${unmatched.length} unmatched.`,
  );
  console.log(
    `${newRecords.length} new payload(s) added to ${out} (${recovered.length - newRecords.length} already known, skipped).`,
  );

  if (unmatched.length > 0) {
    console.log(
      "Unmatched notifications (no raw payload could be correlated):",
    );
    console.table(unmatched);
  }
};

try {
  await recoverFromLogs();

  console.log("End recovery successfully");
} catch (e) {
  if (e instanceof Error) {
    endProcess(e.message);
  } else {
    endProcess("unknown error");
  }
}

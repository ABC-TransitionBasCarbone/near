import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { tmpdir } from "os";
import { join } from "path";
import {
  buildRawSuPayload,
  notificationLine,
  rawPayloadLine,
} from "./logs/logFixtures";
import {
  recoverFromLogs,
  type RecoveredPayloadRecord,
} from "./recover-from-logs";

describe("recoverFromLogs", () => {
  let dir: string;
  let logFile: string;
  let outFile: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "recover-from-logs-"));
    logFile = join(dir, "logs-app.log");
    outFile = join(dir, "recovered.json");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it("throws when file is missing", async () => {
    await expect(recoverFromLogs({ out: outFile })).rejects.toThrow(
      "Verify usage command: file is missing",
    );
  });

  it("throws when the log file does not exist", async () => {
    await expect(
      recoverFromLogs({ file: join(dir, "missing.log"), out: outFile }),
    ).rejects.toThrow("Log file not found");
  });

  it("writes the recovered payload to a new output file", async () => {
    const payload = buildRawSuPayload();
    writeFileSync(
      logFile,
      [
        rawPayloadLine(payload, "2026-07-29 16:17:41.410000000"),
        notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
      ].join("\n"),
    );

    await recoverFromLogs({ file: logFile, out: outFile });

    expect(existsSync(outFile)).toBe(true);
    const records = JSON.parse(
      readFileSync(outFile, "utf-8"),
    ) as RecoveredPayloadRecord[];
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      id: 1,
      surveyName: "Martin Luther King",
      phase: "STEP_2_SU_SURVERY",
      status: "ACTIVE",
      retryCount: 0,
      errorMessage: null,
      resolvedAt: null,
      payload,
    });
  });

  it("is idempotent: re-running on the same log does not duplicate entries", async () => {
    const payload = buildRawSuPayload();
    writeFileSync(
      logFile,
      [
        rawPayloadLine(payload, "2026-07-29 16:17:41.410000000"),
        notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
      ].join("\n"),
    );

    await recoverFromLogs({ file: logFile, out: outFile });
    await recoverFromLogs({ file: logFile, out: outFile });

    const records = JSON.parse(
      readFileSync(outFile, "utf-8"),
    ) as RecoveredPayloadRecord[];
    expect(records).toHaveLength(1);
  });

  it("merges new payloads into an existing output file without touching prior entries", async () => {
    const existingPayload = buildRawSuPayload({ token: "existing-token" });
    const existingRecord: RecoveredPayloadRecord = {
      id: 1,
      surveyName: "Martin Luther King",
      phase: "STEP_2_SU_SURVERY",
      capturedAt: "2026-08-01T00:00:00.000Z",
      status: "RESOLVED",
      retryCount: 1,
      errorMessage: null,
      resolvedAt: "2026-08-01T00:00:01.000Z",
      payload: existingPayload,
    };
    writeFileSync(outFile, JSON.stringify([existingRecord], null, 2));

    const newPayload = buildRawSuPayload({
      token: "new-token",
      neighborhood: "Porte d'Orléans",
    });
    writeFileSync(
      logFile,
      [
        rawPayloadLine(newPayload, "2026-07-29 16:17:41.410000000"),
        notificationLine("Porte d'Orléans", "2026-07-29 16:17:41.441000000"),
      ].join("\n"),
    );

    await recoverFromLogs({ file: logFile, out: outFile });

    const records = JSON.parse(
      readFileSync(outFile, "utf-8"),
    ) as RecoveredPayloadRecord[];
    expect(records).toHaveLength(2);
    expect(records[0]).toEqual(existingRecord);
    expect(records[1]).toMatchObject({
      id: 2,
      surveyName: "Porte d'Orléans",
    });
  });
});

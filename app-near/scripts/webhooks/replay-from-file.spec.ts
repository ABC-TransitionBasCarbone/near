import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { valideSuSurveyPayload } from "~/server/test-utils/suSurvey";
import { getValidSurveyPhase } from "~/server/typeform/helpers";
import { TypeformType, type TypeformWebhookPayload } from "~/types/Typeform";
import { buildRawSuPayload } from "./logs/logFixtures";
import { type RecoveredPayloadRecord } from "./recover-from-logs";
import { replayFromFile, selectRecordsToReplay } from "./replay-from-file";

const suPayload = JSON.parse(
  JSON.stringify(valideSuSurveyPayload),
) as TypeformWebhookPayload;

const buildRecord = (
  overrides: Partial<RecoveredPayloadRecord> = {},
): RecoveredPayloadRecord => ({
  id: 1,
  surveyName: "Martin Luther King",
  phase: "STEP_2_SU_SURVERY",
  capturedAt: "2026-08-01T00:00:00.000Z",
  status: "ACTIVE",
  retryCount: 0,
  errorMessage: null,
  resolvedAt: null,
  payload: buildRawSuPayload(),
  ...overrides,
});

describe("selectRecordsToReplay", () => {
  it("throws when none of id, all=true or surveyName is provided", () => {
    expect(() => selectRecordsToReplay([], {})).toThrow(
      "Verify usage command: id, all=true or surveyName is missing",
    );
  });

  it("throws when a type other than SU is requested", () => {
    expect(() =>
      selectRecordsToReplay([], { all: "true", type: "WAY_OF_LIFE" }),
    ).toThrow("This recovery pipeline only ever produced SU payloads");
  });

  it("throws with the list of valid survey names when surveyName does not match any record", () => {
    const records = [
      buildRecord({ id: 1, surveyName: "Martin Luther King" }),
      buildRecord({ id: 2, surveyName: "Porte d'Orléans" }),
    ];

    expect(() =>
      selectRecordsToReplay(records, { surveyName: "Unknown" }),
    ).toThrow(
      'Survey "Unknown" not found in file. Valid survey names: Martin Luther King, Porte d\'Orléans',
    );
  });

  it("only selects active records", () => {
    const active = buildRecord({ id: 1, status: "ACTIVE" });
    const resolved = buildRecord({ id: 2, status: "RESOLVED" });
    const blocked = buildRecord({ id: 3, status: "BLOCKED" });

    const result = selectRecordsToReplay([active, resolved, blocked], {
      all: "true",
    });

    expect(result.map((r) => r.id)).toEqual([1]);
  });

  it("filters by id and by surveyName", () => {
    const records = [
      buildRecord({ id: 1, surveyName: "Martin Luther King" }),
      buildRecord({ id: 2, surveyName: "Porte d'Orléans" }),
    ];

    expect(
      selectRecordsToReplay(records, { id: "2" }).map((r) => r.id),
    ).toEqual([2]);
    expect(
      selectRecordsToReplay(records, {
        surveyName: "Martin Luther King",
      }).map((r) => r.id),
    ).toEqual([1]);
  });
});

describe("replayFromFile", () => {
  let dir: string;
  let file: string;

  beforeEach(async () => {
    await clearAlldata();
    dir = mkdtempSync(join(tmpdir(), "replay-from-file-"));
    file = join(dir, "recovered.json");
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  const readRecords = (): RecoveredPayloadRecord[] =>
    JSON.parse(readFileSync(file, "utf-8")) as RecoveredPayloadRecord[];

  it("resolves the record and creates the SU answer when the replay succeeds", async () => {
    const survey = await db.survey.create({
      data: {
        name: "name", // matches suPayload's hidden.neighborhood
        phase: getValidSurveyPhase(TypeformType.SU),
      },
    });
    writeFileSync(
      file,
      JSON.stringify(
        [buildRecord({ surveyName: "name", payload: suPayload })],
        null,
        2,
      ),
    );

    await replayFromFile({ file, id: "1" });

    const [record] = readRecords();
    expect(record).toMatchObject({
      status: "RESOLVED",
      retryCount: 1,
      errorMessage: null,
    });
    expect(record!.resolvedAt).not.toBeNull();

    const suAnswer = await db.suAnswer.findFirst({
      where: { surveyId: survey.id },
    });
    expect(suAnswer?.typeformId).toBe(suPayload.form_response.token);
  });

  it("marks the record BLOCKED (not resolved) when the survey phase is still invalid", async () => {
    await db.survey.create({
      data: { name: "name", phase: SurveyPhase.STEP_3_SU_EXPLORATION },
    });
    writeFileSync(
      file,
      JSON.stringify(
        [buildRecord({ surveyName: "name", payload: suPayload })],
        null,
        2,
      ),
    );

    await replayFromFile({ file, id: "1" });

    const [record] = readRecords();
    expect(record!.status).toBe("BLOCKED");
    expect(record!.retryCount).toBe(1);
    expect(record!.errorMessage).toContain("is in phase");
    expect(record!.resolvedAt).toBeNull();

    const suAnswer = await db.suAnswer.findFirst({
      where: { typeformId: suPayload.form_response.token },
    });
    expect(suAnswer).toBeNull();
  });

  it("keeps the record active and stores the error when the replay genuinely fails", async () => {
    // no survey created at all: getSurveyInformations throws NOT_FOUND
    writeFileSync(
      file,
      JSON.stringify(
        [buildRecord({ surveyName: "name", payload: suPayload })],
        null,
        2,
      ),
    );

    await replayFromFile({ file, id: "1" });

    const [record] = readRecords();
    expect(record!.status).toBe("ACTIVE");
    expect(record!.retryCount).toBe(1);
    expect(record!.errorMessage).toBeTruthy();
  });
});

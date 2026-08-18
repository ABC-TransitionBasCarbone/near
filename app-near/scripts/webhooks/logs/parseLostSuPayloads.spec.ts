import {
  buildRawSuPayload as buildPayload,
  convertedAnswerLine,
  noiseLine,
  notificationLine,
  rawPayloadLine,
} from "./logFixtures";
import { parseLostSuPayloads } from "./parseLostSuPayloads";

describe("parseLostSuPayloads", () => {
  it("recovers the raw payload matching a notification", () => {
    const payload = buildPayload();
    const log = [
      noiseLine,
      convertedAnswerLine(),
      rawPayloadLine(payload),
      notificationLine("Martin Luther King"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    expect(result.recovered).toEqual([
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload,
      },
    ]);
  });

  it("handles Windows-style CRLF line endings, as produced by some log exports", () => {
    const payload = buildPayload();
    const log = [
      noiseLine,
      convertedAnswerLine(),
      rawPayloadLine(payload),
      notificationLine("Martin Luther King"),
    ].join("\r\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    expect(result.recovered).toEqual([
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload,
      },
    ]);
  });

  it("ignores the converted-answer debug line, never mistaking it for the raw payload", () => {
    const log = [
      convertedAnswerLine(),
      notificationLine("Martin Luther King"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.recovered).toEqual([]);
    expect(result.unmatched).toEqual([
      { surveyName: "Martin Luther King", phase: "STEP_2_SU_SURVERY" },
    ]);
  });

  it("reports a notification with no preceding raw payload as unmatched", () => {
    const result = parseLostSuPayloads(notificationLine("Porte d'Orléans"));

    expect(result.recovered).toEqual([]);
    expect(result.unmatched).toEqual([
      { surveyName: "Porte d'Orléans", phase: "STEP_2_SU_SURVERY" },
    ]);
  });

  it("ignores unrelated log lines", () => {
    const result = parseLostSuPayloads([noiseLine, noiseLine].join("\n"));

    expect(result.recovered).toEqual([]);
    expect(result.unmatched).toEqual([]);
  });

  it("matches both the '[webhook]' and buggy '[whebhook]' tag spellings, even mixed in the same file", () => {
    const typoPayload = buildPayload({ token: "typo-token" });
    const fixedPayload = buildPayload({
      token: "fixed-token",
      neighborhood: "Porte d'Orléans",
    });
    const log = [
      rawPayloadLine(typoPayload, "2026-07-29 16:17:41.410000000", "whebhook"),
      notificationLine(
        "Martin Luther King",
        "2026-07-29 16:17:41.441000000",
        "STEP_2_SU_SURVERY",
        "whebhook",
      ),
      rawPayloadLine(fixedPayload, "2026-08-01 09:00:00.000000000", "webhook"),
      notificationLine(
        "Porte d'Orléans",
        "2026-08-01 09:00:00.030000000",
        "STEP_2_SU_SURVERY",
        "webhook",
      ),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    expect(result.recovered).toEqual([
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload: typoPayload,
      },
      {
        surveyName: "Porte d'Orléans",
        phase: "STEP_2_SU_SURVERY",
        payload: fixedPayload,
      },
    ]);
  });

  it("correlates independently when several surveys are interleaved", () => {
    const mlkPayload = buildPayload({
      eventId: "mlk-event",
      token: "mlk-token",
      neighborhood: "Martin Luther King",
    });
    const poPayload = buildPayload({
      eventId: "po-event",
      token: "po-token",
      neighborhood: "Porte d'Orléans",
    });
    const log = [
      rawPayloadLine(mlkPayload, "2026-07-29 16:17:41.410000000"),
      rawPayloadLine(poPayload, "2026-07-29 16:17:42.410000000"),
      notificationLine("Porte d'Orléans", "2026-07-29 16:17:42.441000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    expect(result.recovered).toEqual([
      {
        surveyName: "Porte d'Orléans",
        phase: "STEP_2_SU_SURVERY",
        payload: poPayload,
      },
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload: mlkPayload,
      },
    ]);
  });

  it("correlates by timestamp, not by line position (log writes can interleave out of order)", () => {
    const payload = buildPayload();
    // the notification physically appears BEFORE its raw payload line in the file,
    // but its timestamp is still later: correlation must follow the timestamps.
    const log = [
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
      rawPayloadLine(payload, "2026-07-29 16:17:41.410000000"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    expect(result.recovered).toEqual([
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload,
      },
    ]);
  });

  it("recovers both payloads for two near-simultaneous submissions to the same survey", () => {
    const firstPayload = buildPayload({ token: "first-token" });
    const secondPayload = buildPayload({ token: "second-token" });
    const log = [
      rawPayloadLine(firstPayload, "2026-07-29 16:17:41.100000000"),
      rawPayloadLine(secondPayload, "2026-07-29 16:17:41.200000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.130000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.230000000"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.unmatched).toEqual([]);
    // nothing is lost or duplicated: both distinct payloads are recovered, even if
    // the exact notification<->payload pairing were to swap under tight concurrency.
    expect(
      result.recovered.map((r) => r.payload.form_response.token).sort(),
    ).toEqual(["first-token", "second-token"].sort());
  });

  it("treats a raw payload too far in time from the notification as unmatched", () => {
    const payload = buildPayload();
    const log = [
      rawPayloadLine(payload, "2026-07-29 16:17:00.000000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.recovered).toEqual([]);
    expect(result.unmatched).toEqual([
      { surveyName: "Martin Luther King", phase: "STEP_2_SU_SURVERY" },
    ]);
  });

  it("does not reuse an already-consumed payload for a later notification of the same survey", () => {
    const firstPayload = buildPayload({ token: "first-token" });
    const log = [
      rawPayloadLine(firstPayload, "2026-07-29 16:17:41.410000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:41.441000000"),
      notificationLine("Martin Luther King", "2026-07-29 16:17:45.441000000"),
    ].join("\n");

    const result = parseLostSuPayloads(log);

    expect(result.recovered).toEqual([
      {
        surveyName: "Martin Luther King",
        phase: "STEP_2_SU_SURVERY",
        payload: firstPayload,
      },
    ]);
    expect(result.unmatched).toEqual([
      { surveyName: "Martin Luther King", phase: "STEP_2_SU_SURVERY" },
    ]);
  });
});

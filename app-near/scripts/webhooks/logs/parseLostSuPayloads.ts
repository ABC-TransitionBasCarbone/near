import {
  TypeformWebhookSchema,
  type TypeformWebhookPayload,
} from "~/types/Typeform";

// Historical (pre NEAR-87) rejection: `notInPhaseSuSurveyResponse` used to log/return
// exactly `${surveyName} step ${phase} is over for ${surveyName}` and respond 200,
// so the submission was silently dropped: never saved, never recorded as an answer error.
// The "[webhook]" tag itself was a "[whebhook]" typo until a later, separate commit
// (fix webhook typo) - logs from before and after that fix can coexist, so match both:
// "webhook" vs "whebhook" differ by one extra "h" right after the "w".
const TAG_PATTERN = "\\[wh?ebhook]";
const NOTIFICATION_PATTERN = new RegExp(
  `${TAG_PATTERN} (.+) step (\\S+) is over for (.+)$`,
);
const RAW_PAYLOAD_MARKER_PATTERN = new RegExp(`${TAG_PATTERN} su \\{`);
const TIMESTAMP_PATTERN = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{1,9})/;

const MAX_CORRELATION_WINDOW_MS = 5_000;

export type RecoveredSuPayload = {
  surveyName: string;
  phase: string;
  payload: TypeformWebhookPayload;
};

export type ParseLostSuPayloadsResult = {
  recovered: RecoveredSuPayload[];
  unmatched: { surveyName: string; phase: string }[];
};

const parseTimestampMs = (line: string): number | null => {
  const match = TIMESTAMP_PATTERN.exec(line);
  if (!match) return null;

  const parsed = Date.parse(`${match[1]!.replace(" ", "T").slice(0, 23)}Z`);
  return Number.isNaN(parsed) ? null : parsed;
};

const extractRawSuPayload = (line: string): TypeformWebhookPayload | null => {
  const match = RAW_PAYLOAD_MARKER_PATTERN.exec(line);
  if (!match) return null;

  try {
    const jsonStart = match.index + match[0].length - 1;
    const parsed: unknown = JSON.parse(line.slice(jsonStart));
    const result = TypeformWebhookSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
};

type RawPayloadEvent = {
  timestampMs: number;
  neighborhood: string;
  payload: TypeformWebhookPayload;
  consumed: boolean;
};

type NotificationEvent = {
  timestampMs: number | null;
  surveyName: string;
  phase: string;
};

export const parseLostSuPayloads = (
  logContent: string,
): ParseLostSuPayloadsResult => {
  const rawPayloadEvents: RawPayloadEvent[] = [];
  const notifications: NotificationEvent[] = [];

  for (const line of logContent.split(/\r?\n/)) {
    const rawPayload = extractRawSuPayload(line);
    if (rawPayload) {
      const timestampMs = parseTimestampMs(line);
      if (timestampMs !== null) {
        rawPayloadEvents.push({
          timestampMs,
          neighborhood: rawPayload.form_response.hidden.neighborhood,
          payload: rawPayload,
          consumed: false,
        });
      }
      continue;
    }

    const notification = NOTIFICATION_PATTERN.exec(line);
    if (!notification) continue;

    notifications.push({
      timestampMs: parseTimestampMs(line),
      surveyName: notification[1]!,
      phase: notification[2]!,
    });
  }

  const recovered: RecoveredSuPayload[] = [];
  const unmatched: { surveyName: string; phase: string }[] = [];

  for (const notification of notifications) {
    let closest: RawPayloadEvent | null = null;
    let closestDelta = Infinity;

    if (notification.timestampMs !== null) {
      for (const event of rawPayloadEvents) {
        if (event.consumed || event.neighborhood !== notification.surveyName) {
          continue;
        }
        const delta = Math.abs(event.timestampMs - notification.timestampMs);
        if (delta <= MAX_CORRELATION_WINDOW_MS && delta < closestDelta) {
          closest = event;
          closestDelta = delta;
        }
      }
    }

    if (!closest) {
      unmatched.push({
        surveyName: notification.surveyName,
        phase: notification.phase,
      });
      continue;
    }

    closest.consumed = true;
    recovered.push({
      surveyName: notification.surveyName,
      phase: notification.phase,
      payload: closest.payload,
    });
  }

  return { recovered, unmatched };
};

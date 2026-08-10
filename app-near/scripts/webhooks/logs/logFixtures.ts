import { BroadcastChannel } from "@prisma/client";
import { type TypeformWebhookPayload } from "~/types/Typeform";

export const buildRawSuPayload = (
  overrides: Partial<{
    eventId: string;
    token: string;
    neighborhood: string;
  }> = {},
): TypeformWebhookPayload => ({
  event_id: overrides.eventId ?? "01KYQ3SZBR191J6ADYYVG6GYWR",
  event_type: "form_response",
  form_response: {
    form_id: "Td4RtxGf",
    token: overrides.token ?? "4skdjbj2fl88b3q35p64skdjbq2u67js",
    answers: [],
    hidden: {
      neighborhood: overrides.neighborhood ?? "Martin Luther King",
      broadcast_channel: BroadcastChannel.street_survey,
      broadcast_id: "42f96d7e-323f-4953-a505-2e3f39136e00",
    },
    definition: { fields: [] },
  },
});

export const rawPayloadLine = (
  payload: TypeformWebhookPayload,
  timestamp = "2026-07-29 16:17:41.410760327",
  tag = "whebhook",
) => `${timestamp} +0200 CEST [web-1] [${tag}] su ${JSON.stringify(payload)}`;

export const convertedAnswerLine = (
  neighborhood = "Martin Luther King",
  timestamp = "2026-07-29 16:17:41.410771290",
) =>
  `${timestamp} +0200 CEST [web-1] [whebhook] su {"isNeighborhoodResident":true,"ageCategory":"FROM_15_TO_29","neighborhood":"${neighborhood}"}`;

export const notificationLine = (
  surveyName: string,
  timestamp = "2026-07-29 16:17:41.441154959",
  phase = "STEP_2_SU_SURVERY",
  tag = "whebhook",
) =>
  `${timestamp} +0200 CEST [web-1] [${tag}] ${surveyName} step ${phase} is over for ${surveyName}`;

export const noiseLine =
  "2026-07-29 15:21:03.892486543 +0200 CEST [web-1] [TRPC] surveys.getOne took 31ms to execute";

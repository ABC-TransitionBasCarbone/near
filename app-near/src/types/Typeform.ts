import { z } from "zod";
import { BroadcastChannel } from "@prisma/client";

export enum TypeformType {
  SU = "su",
  WAY_OF_LIFE = "way_of_life",
}

export const AnswerSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("text"),
    text: z.string(),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
  z.object({
    type: z.literal("email"),
    email: z.string(),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
  z.object({
    type: z.literal("choice"),
    choice: z.object({
      label: z.string().nullable().optional(),
      ref: z.string().nullable().optional(),
      other: z.string().optional(),
    }),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
  z.object({
    type: z.literal("choices"),
    choices: z.object({
      label: z.array(z.string()).nullable().optional(),
      refs: z.array(z.string()).nullable().optional(),
      other: z.string().optional(),
    }),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
  z.object({
    type: z.literal("boolean"),
    boolean: z.boolean(),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
  z.object({
    type: z.literal("number"),
    number: z.number(),
    field: z.object({
      id: z.string(),
      type: z.string(),
      ref: z.string(),
    }),
  }),
]);

export const TypeformWebhookSchema = z.object({
  event_id: z.string(),
  event_type: z.literal("form_response"),
  form_response: z.object({
    form_id: z.string(),
    answers: z.array(AnswerSchema),
    hidden: z.object({
      neighborhood: z.string(),
      broadcast_channel: z.nativeEnum(BroadcastChannel),
    }),
    definition: z.object({
      fields: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
        }),
      ),
    }),
  }),
});

export type Answer = z.infer<typeof AnswerSchema>;
export type TypeformWebhookPayload = z.infer<typeof TypeformWebhookSchema>;

export type ConvertedAnswer = Record<
  string,
  string | boolean | number | (string | boolean | number | undefined)[]
>;

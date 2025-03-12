import { BroadcastChannel, type CarbonFootprintAnswer } from "@prisma/client";
import { z } from "zod";

export const convertedCarbonFootprintAnswer = z.object({
  email: z.string().email().or(z.literal("")).optional().nullable(),
  broadcastChannel: z.nativeEnum(BroadcastChannel),
});

export type ConvertedCarbonFootprintAnswer = z.infer<
  typeof convertedCarbonFootprintAnswer
>;

export type BuilderCarbonFootprintAnswer = Omit<
  CarbonFootprintAnswer,
  "id" | "createdAt" | "updatedAt" | "su" | "suId"
> &
  Partial<
    Pick<CarbonFootprintAnswer, "id" | "createdAt" | "updatedAt" | "suId">
  >;

import { type WayOfLifeAnswer } from "@prisma/client";
import { z } from "zod";

export const convertedWayOfLifeAnswer = z.object({
  email: z.string().email().or(z.literal("")).optional().nullable(),
});

export type BuilderWayOfLifeAnswer = Omit<
  WayOfLifeAnswer,
  "id" | "createdAt" | "updatedAt"
> &
  Partial<Pick<WayOfLifeAnswer, "id" | "createdAt" | "updatedAt">>;

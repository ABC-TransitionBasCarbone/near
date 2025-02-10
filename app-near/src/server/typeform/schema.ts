import { type z } from "zod";
import { env } from "~/env";
import { suSchema } from "~/types/SuSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<string, z.ZodObject<any>> = {
  [env.SU_FORM_ID]: suSchema,
};

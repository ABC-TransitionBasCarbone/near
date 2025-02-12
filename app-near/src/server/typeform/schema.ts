import { type z } from "zod";
import { env } from "~/env";
import { convertedSuAnswer } from "~/types/SuAnswer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<string, z.ZodObject<any>> = {
  [env.SU_FORM_ID]: convertedSuAnswer,
};

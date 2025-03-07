import { type z } from "zod";
import { env } from "~/env";
import { convertedSuAnswer } from "~/types/SuAnswer";
import { convertedWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<string, z.ZodObject<any>> = {
  [env.SU_FORM_ID]: convertedSuAnswer,
  [env.WAY_OF_LIFE_FORM_ID]: convertedWayOfLifeAnswer,
};

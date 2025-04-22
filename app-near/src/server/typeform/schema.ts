import { type z } from "zod";
import { convertedSuAnswer } from "~/types/SuAnswer";
import { TypeformType } from "~/types/Typeform";
import { convertedWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<TypeformType, z.ZodObject<any>> = {
  [TypeformType.SU]: convertedSuAnswer,
  [TypeformType.WAY_OF_LIFE]: convertedWayOfLifeAnswer,
};

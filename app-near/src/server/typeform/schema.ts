import { type z } from "zod";
import { SurveyId } from "~/types/enums/surveyId";
import { suSchema } from "~/types/SuSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<SurveyId, z.ZodObject<any>> = {
  [SurveyId.SU]: suSchema,
};

import { type z } from "zod";
import { FormId } from "~/types/enums/formId";
import { suSchema } from "~/types/SuSchema";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeformSchemaMapper: Record<FormId, z.ZodObject<any>> = {
  [FormId.SU]: suSchema,
};

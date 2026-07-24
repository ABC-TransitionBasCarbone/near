import { z } from "zod";
import { safeString } from "../shared/sanitize/sanitize";

export const neighborhoodConfigSchema = z.object({
  northCloseLocations: safeString.optional(),
  northDistantLocations: safeString.optional(),
  southCloseLocations: safeString.optional(),
  southDistantLocations: safeString.optional(),
  eastCloseLocations: safeString.optional(),
  eastDistantLocations: safeString.optional(),
  westCloseLocations: safeString.optional(),
  westDistantLocations: safeString.optional(),
});

export type NeighborhoodConfigFormValues = z.infer<
  typeof neighborhoodConfigSchema
>;

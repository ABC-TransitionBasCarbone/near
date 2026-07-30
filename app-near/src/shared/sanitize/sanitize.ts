import { z } from "zod";

const HTML_TAG_REGEX = /<[a-zA-Z/!][^>]*>/;

export const safeString = z
  .string()
  .refine((data) => !HTML_TAG_REGEX.test(data), {
    message: "Ce format n'est pas autorisé",
  });

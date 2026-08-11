import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof z.ZodError) {
    return JSON.stringify(error.errors);
  }

  if (error instanceof TRPCError) {
    return `${error.code}: ${error.message}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
};

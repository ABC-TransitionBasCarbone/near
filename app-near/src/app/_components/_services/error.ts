import { TRPCClientError } from "@trpc/client";
import { type ErrorCode, errorCodeMapper } from "~/types/enums/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorValue = (e: any): string => {
  let value = "Une erreur s'est produite veuillez ré-essayer plus tard";
  if (e instanceof TRPCClientError) {
    value =
      errorCodeMapper[e.message as ErrorCode] ??
      "Une erreur s'est produite, veuillez ré-essayer plus tard.";
  }

  return value;
};

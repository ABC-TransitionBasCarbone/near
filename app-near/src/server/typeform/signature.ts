import crypto from "crypto";
import { env } from "~/env";

export const signPayload = (payload: string) => {
  const hash = crypto
    .createHmac("sha256", env.TYPEFORM_SECRET)
    .update(payload)
    .digest("base64");

  return `sha256=${hash}`;
};

export const verifySignature = (sign: string | null, payload: string) => {
  return sign === signPayload(payload);
};

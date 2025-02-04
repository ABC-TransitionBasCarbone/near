import crypto from "crypto";
import { env } from "~/env";

export const verifySignature = (sign: string, payload: string) => {
  const hash = crypto
    .createHmac("sha256", env.TYPEFORM_SECRET)
    .update(payload)
    .digest("base64");

  return sign === `sha256=${hash}`;
};

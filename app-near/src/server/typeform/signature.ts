import crypto from "crypto";
import { type NextRequest } from "next/server";
import { env } from "~/env";

export enum SignatureType {
  TYPEFORM = "typeform",
  NGC_FORM = "ngc_form",
}

const headerMapper: Record<SignatureType, string> = {
  [SignatureType.NGC_FORM]: "Ngc-Signature",
  [SignatureType.TYPEFORM]: "Typeform-Signature",
};

export const signPayload = (payload: string) => {
  const hash = crypto
    .createHmac("sha256", env.TYPEFORM_SECRET)
    .update(payload)
    .digest("base64");

  return `sha256=${hash}`;
};

export const isValidSignature = (
  req: NextRequest,
  body: string,
  signatureType: SignatureType,
): boolean => {
  const signature = req.headers.get(headerMapper[signatureType]);
  return signature === signPayload(body);
};

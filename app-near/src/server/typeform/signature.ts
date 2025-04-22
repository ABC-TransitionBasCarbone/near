import crypto from "crypto";
import { type NextRequest } from "next/server";
import { env } from "~/env";

export enum SignatureType {
  TYPEFORM = "typeform",
  NGC_FORM = "ngc_form",
}

const signatureTypeMapper: Record<
  SignatureType,
  { headerName: string; secretKey: string }
> = {
  [SignatureType.NGC_FORM]: {
    headerName: "Ngc-Signature",
    secretKey: env.NGC_SECRET,
  },
  [SignatureType.TYPEFORM]: {
    headerName: "Typeform-Signature",
    secretKey: env.TYPEFORM_SECRET,
  },
};

export const signPayload = (payload: string, signatureType: SignatureType) => {
  const hash = crypto
    .createHmac("sha256", signatureTypeMapper[signatureType].secretKey)
    .update(payload)
    .digest("base64");

  return `sha256=${hash}`;
};

export const isValidSignature = (
  req: NextRequest,
  body: string,
  signatureType: SignatureType,
): boolean => {
  const signature = req.headers.get(
    signatureTypeMapper[signatureType].headerName,
  );
  return signature === signPayload(body, signatureType);
};

export const isValidSignature = (req: NextRequest, body: string): boolean => {
  const signature = req.headers.get("Typeform-Signature");
  return verifySignature(signature, body);
};

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import {
  type TypeformWebhookPayload,
  TypeformWebhookSchema,
} from "~/types/typeform";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import { handleSuForm } from "./handlers/handleSuForm";
import { verifySignature } from "./signature";

export const handleAnswer = async (req: NextRequest): Promise<NextResponse> => {
  let formId: string | undefined = undefined;
  try {
    const body = await req.text();
    const parsedBody: TypeformWebhookPayload = TypeformWebhookSchema.parse(
      JSON.parse(body),
    );
    formId = parsedBody.form_response.form_id;
    console.debug("[whebhook typeform]", formId, body);

    if (!isValidSignature(req, body)) {
      return unauthorizedResponse(formId);
    }

    const referencesMapping = getReferencesMapping(formId);
    if (!referencesMapping) {
      return referenceMappingNotFoundResponse(formId);
    }

    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.debug("[whebhook typeform]", formId, JSON.stringify(answers));

    if (formId === env.SU_FORM_ID) {
      return await handleSuForm(parsedBody, answers, formId);
    }
    return unknwonFormIdResponse(formId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[whebhook typeform]", formId, "ZOD ERROR :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      console.error("[whebhook typeform]", formId, "ERROR :", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[whebhook typeform]", formId, "UNKNOWN ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

const isValidSignature = (req: NextRequest, body: string): boolean => {
  const signature = req.headers.get("Typeform-Signature");
  return verifySignature(signature, body);
};

const unknwonFormIdResponse = (formId?: string): NextResponse =>
  NextResponse.json(
    { error: "Unknown formid", details: formId },
    { status: 404 },
  );

const unauthorizedResponse = (formId?: string): NextResponse =>
  NextResponse.json(
    { error: "Not authorized", details: formId },
    { status: 401 },
  );

const referenceMappingNotFoundResponse = (formId?: string): NextResponse => {
  console.error(
    "[whebhook typeform]",
    formId,
    "ERROR: References mapping not found",
  );
  return NextResponse.json(
    { error: "References mapping not found" },
    { status: 400 },
  );
};

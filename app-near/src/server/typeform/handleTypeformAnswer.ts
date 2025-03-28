import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { env } from "~/env";
import {
  type TypeformWebhookPayload,
  TypeformWebhookSchema,
} from "~/types/Typeform";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import { handleSuForm } from "./handlers/handleSuForm";
import { isValidSignature, SignatureType } from "./signature";
import { handleWayOfLifeForm } from "./handlers/handleWayOfLifeForm";

export const handleTypeformAnswer = async (
  req: NextRequest,
): Promise<NextResponse> => {
  let formId: string | undefined = undefined;
  try {
    const body = await req.text();
    const parsedBody: TypeformWebhookPayload = TypeformWebhookSchema.parse(
      JSON.parse(body),
    );
    formId = parsedBody.form_response.form_id;
    console.debug("[whebhook]", formId, body);

    if (!isValidSignature(req, body, SignatureType.TYPEFORM)) {
      return unauthorizedResponse(formId);
    }

    const referencesMapping = getReferencesMapping(formId);
    if (!referencesMapping) {
      return referenceMappingNotFoundResponse(formId);
    }

    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.debug("[whebhook]", formId, JSON.stringify(answers));

    if (formId === env.SU_FORM_ID) {
      return await handleSuForm(
        answers,
        formId,
        parsedBody.form_response.hidden.neighborhood,
        parsedBody.form_response.hidden.broadcast_channel,
      );
    }

    if (formId === env.WAY_OF_LIFE_FORM_ID) {
      return await handleWayOfLifeForm(
        answers,
        formId,
        parsedBody.form_response.hidden?.neighborhood,
        parsedBody.form_response.hidden?.broadcast_channel,
      );
    }

    return unknwonFormIdResponse(formId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[whebhook]", formId, "ZOD ERROR :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      console.error("[whebhook]", formId, "ERROR :", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[whebhook]", formId, "UNKNOWN ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
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
  console.error("[whebhook]", formId, "ERROR: References mapping not found");
  return NextResponse.json(
    { error: "References mapping not found" },
    { status: 400 },
  );
};

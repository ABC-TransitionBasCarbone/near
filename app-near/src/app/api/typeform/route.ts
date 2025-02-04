import { NextResponse } from "next/server";
import { z } from "zod";
import { TypeformWebhookSchema } from "~/types/typeform";
import { convertFormToAnswer } from "~/server/typeform/convert";
import { verifySignature } from "~/server/typeform/signature";
import { SurveyId } from "~/types/enums/surveyId";
import { createSu } from "~/server/su/create";
import { getReferencesMapping } from "~/server/surveys/references";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const parsedBody = TypeformWebhookSchema.parse(JSON.parse(body));
    const header = req.headers;

    const formId = parsedBody.form_response.form_id;
    const signature = header.get("Typeform-Signature") ?? "";

    const isSecure = verifySignature(signature, body);

    if (!isSecure) {
      return NextResponse.json(
        { error: "not authorized", details: formId },
        { status: 401 },
      );
    }

    const referencesMapping = getReferencesMapping(formId);

    if (!referencesMapping) {
      return NextResponse.json(
        { error: "references not found", detail: formId },
        { status: 401 },
      );
    }

    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.log("📩 Réponses formatées :", answers);

    if (formId === SurveyId.SU) {
      await createSu(answers);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Erreur de validation :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }
    console.error("❌ Erreur webhook Typeform:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

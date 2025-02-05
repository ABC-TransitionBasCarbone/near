import { type NextRequest, NextResponse } from "next/server";
import { verifySignature } from "./signature";
import { SurveyId } from "~/types/enums/surveyId";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import { TypeformWebhookSchema } from "~/types/typeform";
import { typeformSchemaMapper } from "./schema";
import { createSu } from "../su/create";
import { type SuAnswer } from "@prisma/client";
import { z } from "zod";

export const handleAnswer = async (req: NextRequest): Promise<NextResponse> => {
  let formId: SurveyId | undefined = undefined;
  try {
    const body = await req.text();
    const parsedBody = TypeformWebhookSchema.parse(JSON.parse(body));
    const header = req.headers;
    formId = parsedBody.form_response.form_id;
    const signature = header.get("Typeform-Signature") ?? "";
    console.info("[whebhook typeform]", formId, body);

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
    console.info("[whebhook typeform]", formId, JSON.stringify(answers));

    const parsedAnswer = typeformSchemaMapper[formId].parse(answers);

    if (formId === SurveyId.SU) {
      await createSu(parsedAnswer as SuAnswer);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[whebhook typeform]", formId, "ZOD ERROR :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }
    console.error("[whebhook typeform]", formId, "ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

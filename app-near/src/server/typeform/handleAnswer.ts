import { type NextRequest, NextResponse } from "next/server";
import { verifySignature } from "./signature";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import {
  type TypeformWebhookPayload,
  TypeformWebhookSchema,
} from "~/types/typeform";
import { typeformSchemaMapper } from "./schema";
import { createSu } from "../su/create";
import { AgeCategory, type SuAnswer } from "@prisma/client";
import { z } from "zod";
import { env } from "~/env";
import { type ConvertedSuAnswer } from "~/types/SuAnswer";

export const handleAnswer = async (req: NextRequest): Promise<NextResponse> => {
  let formId: string | undefined = undefined;
  try {
    // parse body
    const body = await req.text();
    const parsedBody: TypeformWebhookPayload = TypeformWebhookSchema.parse(
      JSON.parse(body),
    );
    formId = parsedBody.form_response.form_id;
    console.info("[whebhook typeform]", formId, body);

    // check typeform signature header
    if (!isValidSignature(req, body)) {
      return unauthorizedResponse(formId);
    }

    // get reference mapping
    const referencesMapping = getReferencesMapping(formId);
    if (!referencesMapping) {
      return referenceMappingNotFoundResponse(formId);
    }

    // convert
    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.info("[whebhook typeform]", formId, JSON.stringify(answers));

    // switch case mapping depending on forms
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

const handleSuForm = async (
  parsedBody: TypeformWebhookPayload,
  answers: Record<string, string | boolean>,
  formId: string,
): Promise<
  NextResponse<{ message: string }> | NextResponse<{ error: string }>
> => {
  if (answers.isNeighborhoodResident !== true) {
    return NextResponse.json(
      { message: "user should live in neighborhood" },
      { status: 200 },
    );
  }
  if (
    !Object.values(AgeCategory).includes(answers.ageCategory as AgeCategory)
  ) {
    return NextResponse.json(
      { message: "user age is not allowed" },
      { status: 200 },
    );
  }

  const parsedAnswer = typeformSchemaMapper[formId]?.parse(answers);
  const surveyName = parsedBody.form_response.hidden?.neighborhood;
  if (!surveyName) {
    console.error("[whebhook typeform]", formId, "Survey name not found");
    return NextResponse.json(
      { error: "Survey name not found" },
      { status: 400 },
    );
  }
  const broadcastChannel = parsedBody.form_response.hidden?.broadcast_channel;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isNeighborhoodResident, ...answersToCreate } =
    parsedAnswer as ConvertedSuAnswer;

  await createSu(
    { ...answersToCreate, broadcastChannel } as SuAnswer,
    surveyName,
  );

  return NextResponse.json({ message: "created" }, { status: 201 });
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

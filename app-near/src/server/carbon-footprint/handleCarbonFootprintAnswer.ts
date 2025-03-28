import { NextResponse, type NextRequest } from "next/server";
import { getSurveyInformations } from "../typeform/handlers/helpers";
import { createCarbonFooprintAnswer } from "./create";
import { sendPhaseTwoFormNotification } from "../surveys/email";
import {
  convertedCarbonFootprintAnswer,
  type NgcWebhookPayload,
  NgcWebhookSchema,
} from "~/types/CarbonFootprint";
import { convertCarbonFootprintBody } from "./convert";
import { isValidSignature, SignatureType } from "../typeform/signature";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";

const formId = "ngc-form";

const unauthorizedResponse = (): NextResponse =>
  NextResponse.json(
    { error: "Not authorized", details: formId },
    { status: 401 },
  );

export const handleCarbonFootprintAnswer = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const body = await req.text();
    const parsedBody: NgcWebhookPayload = NgcWebhookSchema.parse(
      JSON.parse(body),
    );

    if (!isValidSignature(req, body, SignatureType.NGC_FORM)) {
      return unauthorizedResponse();
    }

    const { surveyName } = await getSurveyInformations(
      parsedBody.neighborhood,
      formId,
    );

    const carbonFootprintAnswer = convertCarbonFootprintBody(parsedBody);

    // could throw zod exception from zod parsing
    const parsedAnswer = convertedCarbonFootprintAnswer.parse(
      carbonFootprintAnswer,
    );

    await createCarbonFooprintAnswer(parsedAnswer, surveyName);

    if (parsedAnswer.email) {
      await sendPhaseTwoFormNotification(parsedAnswer.email);
    }

    return NextResponse.json({ message: "created" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[whebhook]", formId, "ZOD ERROR :", error.errors);
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof TRPCError) {
      return new NextResponse(
        JSON.stringify({
          code: error.code,
          message: error.message,
          data: error.cause ?? null,
        }),
        { status: getHTTPStatusCodeFromError(error) },
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

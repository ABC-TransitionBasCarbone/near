import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import {
  CarbonFootprintType,
  convertedCarbonFootprintAnswer,
  NgcWebhookSchema,
  type NgcWebhookPayload,
} from "~/types/CarbonFootprint";
import { getSurveyInformations } from "../typeform/helpers";
import { isValidSignature, SignatureType } from "../typeform/signature";
import { convertCarbonFootprintBody } from "./convert";
import { createCarbonFooprintAnswer } from "./create";

const unauthorizedResponse = (): NextResponse =>
  NextResponse.json(
    { error: "Not authorized", details: CarbonFootprintType.CARBON_FOOTPRINT },
    { status: 401 },
  );

export const handleCarbonFootprintAnswer = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const body = await req.text();

    // could throw zod exception from zod parsing
    const parsedBody: NgcWebhookPayload = NgcWebhookSchema.parse(
      JSON.parse(body),
    );

    if (!isValidSignature(req, body, SignatureType.NGC_FORM)) {
      return unauthorizedResponse();
    }

    const { survey } = await getSurveyInformations(
      parsedBody.neighborhoodId,
      CarbonFootprintType.CARBON_FOOTPRINT,
    );

    const carbonFootprintAnswer = convertCarbonFootprintBody(parsedBody);

    // could throw zod exception from zod parsing
    const parsedAnswer = convertedCarbonFootprintAnswer.parse(
      carbonFootprintAnswer,
    );

    await createCarbonFooprintAnswer(parsedAnswer, survey);

    return NextResponse.json({ message: "created" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "[whebhook]",
        CarbonFootprintType.CARBON_FOOTPRINT,
        "ZOD ERROR :",
        error,
      );
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
      console.error(
        "[whebhook]",
        CarbonFootprintType.CARBON_FOOTPRINT,
        "ERROR :",
        error.message,
      );
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error(
      "[whebhook]",
      CarbonFootprintType.CARBON_FOOTPRINT,
      "UNKNOWN ERROR:",
      error,
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

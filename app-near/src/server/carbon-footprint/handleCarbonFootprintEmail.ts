import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "../db";
import { isValidSignature, SignatureType } from "../typeform/signature";
import { sendPhaseTwoFormNotification } from "../surveys/email";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { ErrorCode } from "~/types/enums/error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const anonymize = (data: Record<string, any>) => ({ ...data, email: "***" });

export const handleCarbonFootprintEmail = async (
  req: NextRequest,
): Promise<NextResponse> => {
  const bodyText = await req.text();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const bodyJson = JSON.parse(bodyText);
  try {
    const bodySchema = z.object({ email: z.string().email(), id: z.string() });
    const body = bodySchema.parse(JSON.parse(bodyText));

    if (!isValidSignature(req, bodyText, SignatureType.NGC_FORM)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { email, id } = body;

    const result = await db.carbonFootprintAnswer.update({
      data: { email },
      where: { externalId: id },
      include: { survey: true, su: true },
    });

    await sendPhaseTwoFormNotification(
      email,
      result.survey.name,
      result.su?.su,
      { displayCarbonFootprint: "false", displayWayOfLife: "true" },
    );

    return NextResponse.json({ message: "Email processed" }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("ZOD ERROR:", error.errors);
      return NextResponse.json(
        { error: "Invalid request body", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      console.error("ERROR:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let anonymizedBody = bodyJson;
    if (typeof anonymizedBody === "object" && !Array.isArray(anonymizedBody)) {
      anonymizedBody = JSON.stringify(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        anonymize(anonymizedBody as Record<string, any>),
      );
    }

    console.error(
      "[whebhook ngcform email]",
      `unexpected error:`,
      error,
      "BODY:",
      anonymizedBody,
    );

    console.error("UNHANDLED ERROR:", error);
    return NextResponse.json(
      JSON.stringify({ error: ErrorCode.UNEXPECTED_NGCFORM_EMAIL }),
      {
        status: 500,
      },
    );
  }
};

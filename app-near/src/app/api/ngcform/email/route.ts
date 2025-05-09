/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import { handleCarbonFootprintEmail } from "~/server/carbon-footprint/handleCarbonFootprintEmail";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { ErrorCode } from "~/types/enums/error";

const anonymize = (data: Record<string, any>) => ({ ...data, email: "***" });

export async function POST(req: NextRequest) {
  try {
    return handleCarbonFootprintEmail(req);
  } catch (error) {
    if (error instanceof TRPCError) {
      return new Response(
        JSON.stringify({
          code: error.code,
          message: error.message,
          data: error.cause ?? null,
        }),
        { status: getHTTPStatusCodeFromError(error) },
      );
    }

    let body = await req.json();
    if (typeof body === "object" && !Array.isArray(body)) {
      body = JSON.stringify(anonymize(body as Record<string, any>));
    }

    console.error(
      "[whebhook ngcform email]",
      `unexpected error:`,
      error,
      "BODY:",
      body,
    );

    return new Response(
      JSON.stringify({ error: ErrorCode.UNEXPECTED_NGCFORM_EMAIL }),
      {
        status: 500,
      },
    );
  }
}

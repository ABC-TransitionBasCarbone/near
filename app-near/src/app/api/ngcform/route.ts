/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TRPCError } from "@trpc/server";
import { type NextRequest } from "next/server";
import { handleCarbonFootprintAnswer } from "~/server/carbon-footprint/handleCarbonFootprintAnswer";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { ErrorCode } from "~/types/enums/error";

const anonymize = (data: Record<string, any>) => ({ ...data, email: "" });

export async function POST(req: NextRequest) {
  try {
    return handleCarbonFootprintAnswer(req);
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

    const body = await req.json();
    let message = body;

    if (typeof body === "object" && !Array.isArray(body)) {
      message = JSON.stringify(anonymize(body as Record<string, any>));
    }

    console.error(
      "[whebhook ngcform]",
      `unexpected error:`,
      error,
      "BODY:",
      message,
    );

    return new Response(
      JSON.stringify({ error: ErrorCode.UNEXPECTED_NGCFORM }),
      {
        status: 500,
      },
    );
  }
}

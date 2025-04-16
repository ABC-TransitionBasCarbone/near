/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextRequest } from "next/server";
import { handleCarbonFootprintAnswer } from "~/server/carbon-footprint/handleCarbonFootprintAnswer";
import { ErrorCode } from "~/types/enums/error";

const anonymize = (data: Record<string, any>) => ({ ...data, email: "" });

export async function POST(req: NextRequest) {
  try {
    return handleCarbonFootprintAnswer(req);
  } catch (error) {
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

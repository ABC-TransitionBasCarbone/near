import { type NextRequest } from "next/server";
import { handleCarbonFootprintAnswer } from "~/server/carbon-footprint/handleCarbonFootprintAnswer";

export async function POST(req: NextRequest) {
  return handleCarbonFootprintAnswer(req);
}

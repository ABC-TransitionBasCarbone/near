import { type NextRequest } from "next/server";
import { handleCarbonFootprintEmail } from "~/server/carbon-footprint/handleCarbonFootprintEmail";

export async function POST(req: NextRequest) {
  return handleCarbonFootprintEmail(req);
}

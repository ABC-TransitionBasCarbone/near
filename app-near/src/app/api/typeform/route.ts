import { type NextRequest } from "next/server";
import { handleTypeformAnswer } from "~/server/typeform/handleTypeformAnswer";

export async function POST(req: NextRequest) {
  return handleTypeformAnswer(req);
}

import { type NextRequest } from "next/server";
import { handleAnswer } from "~/server/typeform/handleAnswer";

export async function POST(req: NextRequest) {
  return handleAnswer(req);
}

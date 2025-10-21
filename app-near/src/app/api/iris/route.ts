import { RoleName } from "@prisma/client";
import { type NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "~/server/auth";
import { getAllInseeIris } from "~/server/insee/get";
import { userIsGranted } from "~/shared/services/roles/grant-rules";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!userIsGranted(session?.user, [RoleName.ADMIN])) {
    return NextResponse.json({ message: "not authorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";

  const filtered = await getAllInseeIris(query);
  return NextResponse.json(filtered.slice(0, 50)); // limiter à 50 résultats
}

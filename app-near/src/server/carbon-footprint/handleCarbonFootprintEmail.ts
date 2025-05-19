import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { db } from "../db";
import { isValidSignature, SignatureType } from "../typeform/signature";
import { sendPhaseTwoFormNotification } from "../surveys/email";

export const handleCarbonFootprintEmail = async (
  req: NextRequest,
): Promise<NextResponse> => {
  try {
    const bodyText = await req.text();
    const bodySchema = z.object({ email: z.string().email() });
    const body = bodySchema.parse(JSON.parse(bodyText));

    if (!isValidSignature(req, bodyText, SignatureType.NGC_FORM)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const { email } = body;

    const contact = await db.ngcContact.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    const status =
      contact.createdAt.getTime() === contact.updatedAt.getTime() ? 201 : 200;

    await sendPhaseTwoFormNotification(email, "Porte d'Orléans");

    return NextResponse.json(
      { message: "Email processed" },
      { status: status },
    );
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

    console.error("UNHANDLED ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

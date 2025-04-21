import { NextResponse, type NextRequest } from "next/server";
import { type NgcContact } from "@prisma/client";
import { db } from "../db";
import { isValidSignature } from "../typeform/signature";
import { sendPhaseTwoFormNotification } from "../surveys/email";

export const handleCarbonFootprintEmail = async (
  req: NextRequest,
): Promise<NextResponse> => {
  const bodyText = await req.text();

  if (!isValidSignature(req, bodyText)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const body = JSON.parse(bodyText) as NgcContact;
  const { email } = body;

  if (!email) {
    throw new Error("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  const existingContact = await db.ngcContact.findFirst({
    where: { email },
  });

  if (existingContact) {
    return NextResponse.json({ error: "Email already saved" }, { status: 409 });
  }

  await sendPhaseTwoFormNotification(email);

  await db.ngcContact.create({
    data: { email },
  });

  return NextResponse.json({ message: "Email saved" }, { status: 201 });
};

import { NextResponse, type NextRequest } from "next/server";
import { getSurveyInformations } from "../typeform/handlers/helpers";
import { type CarbonFootprintAnswer } from "@prisma/client";
import { createCarbonFooprintAnswer } from "./create";
import { sendPhaseTwoFormNotification } from "../surveys/email";
import { convertedCarbonFootprintAnswer } from "~/types/CarbonFootprint";

export const handleCarbonFootprintAnswer = async (
  req: NextRequest,
): Promise<NextResponse> => {
  // verify signature or other sercurity NEAR-47

  const body = (await req.json()) as CarbonFootprintAnswer & {
    neighborhood: string;
    broadcastChannel: BroadcastChannel;
  };
  const { neighborhood, ...data } = body;

  // could throw zod exception from zod parsing
  const parsedAnswer = convertedCarbonFootprintAnswer.parse(data);

  const { surveyName } = await getSurveyInformations(neighborhood, "ngc-form");

  await createCarbonFooprintAnswer(
    parsedAnswer as CarbonFootprintAnswer,
    surveyName,
  );

  if (parsedAnswer.email) {
    await sendPhaseTwoFormNotification(parsedAnswer.email);
  }

  return NextResponse.json({ message: "created" }, { status: 201 });
};

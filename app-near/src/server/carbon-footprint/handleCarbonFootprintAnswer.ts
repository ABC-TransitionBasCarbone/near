import { NextResponse, type NextRequest } from "next/server";
import {
  getSurveyInformations,
  isNotInPhase,
  notInPhaseSuSurveyResponse,
} from "../typeform/handlers/helpers";
import { SurveyPhase, type CarbonFootprintAnswer } from "@prisma/client";
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

  const { surveyName, survey } = await getSurveyInformations(
    neighborhood,
    "ngc-form",
  );

  if (isNotInPhase(survey, SurveyPhase.STEP_4_ADDITIONAL_SURVEY)) {
    return notInPhaseSuSurveyResponse(
      surveyName,
      SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    );
  }

  await createCarbonFooprintAnswer(
    parsedAnswer as CarbonFootprintAnswer,
    surveyName,
  );

  if (parsedAnswer.email) {
    await sendPhaseTwoFormNotification(parsedAnswer.email);
  }

  return NextResponse.json({ message: "created" }, { status: 201 });
};

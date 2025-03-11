import { NextResponse } from "next/server";
import { typeformSchemaMapper } from "../schema";
import { getSurveyInformations } from "./helpers";
import { type BroadcastChannel, type WayOfLifeAnswer } from "@prisma/client";
import { sendPhaseTwoFormNotification } from "~/server/surveys/email";
import { createWayOfLifeAnswer } from "~/server/way-of-life/create";

export const handleWayOfLifeForm = async (
  answers: Record<string, string | boolean>,
  formId: string,
  neighborhood: string,
  broadcastChannel: BroadcastChannel,
): Promise<
  NextResponse<{ message: string }> | NextResponse<{ error: string }>
> => {
  // could throw zod exception from zod parsing
  const parsedAnswer = typeformSchemaMapper[formId]?.parse(
    answers,
  ) as WayOfLifeAnswer;

  const { surveyName } = await getSurveyInformations(neighborhood, formId);

  await createWayOfLifeAnswer(
    { ...parsedAnswer, broadcastChannel },
    surveyName,
  );

  if (parsedAnswer?.email) {
    await sendPhaseTwoFormNotification(parsedAnswer.email);
  }

  return NextResponse.json({ message: "created" }, { status: 201 });
};

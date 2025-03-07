import { NextResponse } from "next/server";
import { typeformSchemaMapper } from "../schema";
import {
  getSurveyInformations,
  isNotInPhase,
  notInPhaseSuSurveyResponse,
} from "./helpers";
import {
  type BroadcastChannel,
  SurveyPhase,
  type WayOfLifeAnswer,
} from "@prisma/client";
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

  const { surveyName, survey } = await getSurveyInformations(
    neighborhood,
    formId,
  );

  if (isNotInPhase(survey, SurveyPhase.STEP_4_ADDITIONAL_SURVEY)) {
    return notInPhaseSuSurveyResponse(
      surveyName,
      SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    );
  }

  await createWayOfLifeAnswer(
    { ...parsedAnswer, broadcastChannel },
    surveyName,
  );

  if (parsedAnswer?.email) {
    await sendPhaseTwoFormNotification(parsedAnswer.email);
  }

  return NextResponse.json({ message: "created" }, { status: 201 });
};

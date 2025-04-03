import {
  AgeCategory,
  type BroadcastChannel,
  type SuAnswer,
  SurveyPhase,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { createSu } from "../../su/answers/create";
import { typeformSchemaMapper } from "../schema";
import { type ConvertedSuAnswer } from "~/types/SuAnswer";
import {
  getSurveyInformations,
  isNotInPhase,
  notInPhaseSuSurveyResponse,
} from "./helpers";
import { type ConvertedAnswer } from "~/types/Typeform";

export const handleSuForm = async (
  answers: ConvertedAnswer,
  formId: string,
  neighborhood: string,
  broadcastChannel: BroadcastChannel,
): Promise<
  NextResponse<{ message: string }> | NextResponse<{ error: string }>
> => {
  if (isNotPartOfNeighborhood(answers)) {
    return okResponse("user should live in neighborhood");
  }

  if (isUnder15(answers)) {
    return okResponse("user should be under 15");
  }

  // could throw zod exception from zod parsing
  const parsedAnswer = typeformSchemaMapper[formId]?.parse(
    answers,
  ) as ConvertedSuAnswer;

  // remove isNeighborhoodResident property before save
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isNeighborhoodResident, ...createQuery } = parsedAnswer;

  const { surveyName, survey } = await getSurveyInformations(
    neighborhood,
    formId,
  );

  if (isNotInPhase(survey, SurveyPhase.STEP_2_SU_SURVERY)) {
    return notInPhaseSuSurveyResponse(
      surveyName,
      SurveyPhase.STEP_2_SU_SURVERY,
    );
  }

  // create su
  await createSu({ ...createQuery, broadcastChannel } as SuAnswer, surveyName);

  return NextResponse.json({ message: "created" }, { status: 201 });
};

const okResponse = (message: string): NextResponse<{ message: string }> =>
  NextResponse.json({ message }, { status: 200 });

const isUnder15 = (answers: ConvertedAnswer) => {
  return !Object.values(AgeCategory).includes(
    answers.ageCategory as AgeCategory,
  );
};

const isNotPartOfNeighborhood = (answers: ConvertedAnswer) => {
  return answers.isNeighborhoodResident !== true;
};

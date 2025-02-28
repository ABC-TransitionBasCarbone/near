import { SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import {
  buildSuComputationRequest,
  computeSus,
} from "~/server/external-api/api-su";
import { updateSuAnswerWithSu } from "~/server/su/answers/update";
import { saveSuData } from "~/server/su/data/save";
import { updateSurvey } from "~/server/surveys/put";
import { ErrorCode } from "~/types/enums/error";

export const computeSu = async (surveyId: number): Promise<string[]> => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });
  if (!survey || survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION) {
    throw new TRPCError({
      code: "UNPROCESSABLE_CONTENT",
      message: ErrorCode.WRONG_SURVEY_PHASE,
    });
  }

  const request = await buildSuComputationRequest(surveyId);
  if (request.length === 0) {
    return [];
  }

  const response = await computeSus(request);

  return await db.$transaction(async () => {
    const suNames = await saveSuData(surveyId, response.computedSus);

    await updateSuAnswerWithSu(surveyId, response.answerAttributedSu);

    await updateSurvey(surveyId, { computedSu: true });

    return suNames;
  });
};

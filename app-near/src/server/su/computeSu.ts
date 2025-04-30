import { SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { db } from "~/server/db";
import apiSuService from "~/server/external-api/api-su";
import { updateSuAnswerWithSu } from "~/server/su/answers/update";
import { saveSuData } from "~/server/su/data/save";
import { updateSurvey } from "~/server/surveys/put";
import { ErrorCode } from "~/types/enums/error";

export const getSuList = async (surveyId: number): Promise<number[] | null> => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });
  if (!survey?.computedSu) {
    return null;
  }

  const su = await db.suData.findMany({ where: { surveyId: survey.id } });

  return su.map((item) => item.id);
};

export const computeSu = async (surveyId: number): Promise<number[]> => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });
  if (!survey || survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.WRONG_SURVEY_PHASE,
    });
  }

  const request = await apiSuService.buildSuComputationRequest(surveyId);
  if (request.length === 0) {
    return [];
  }

  try {
    const response = await apiSuService.computeSus(request);
    return await db.$transaction(
      async () => {
        const suNames = await saveSuData(surveyId, response.computedSus);

        await updateSuAnswerWithSu(surveyId, response.answerAttributedSu);

        await updateSurvey(surveyId, { computedSu: true });

        return suNames;
      },
      {
        timeout: 30000,
      },
    );
  } catch (error) {
    if (error instanceof TypeError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: ErrorCode.UNEXPECTED_COMPUTE_SU_ERROR,
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: ErrorCode.UNEXPECTED_ERROR,
    });
  }
};

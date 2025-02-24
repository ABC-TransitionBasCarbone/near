import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { type Survey, SurveyPhase } from "@prisma/client";
import representativenessService from "../su/answers/representativeness";
import {
  getBelowThresholdValues,
  THRESHOLD_VALUE,
} from "~/shared/services/su-surveys/threshold";

const allSurveyPhases = Object.values(SurveyPhase);
export const surveyAllowedIncomingSteps: Record<SurveyPhase, SurveyPhase[]> = {
  [SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION]: allSurveyPhases,
  [SurveyPhase.STEP_2_SU_SURVERY]: allSurveyPhases,
  [SurveyPhase.STEP_3_SU_EXPLORATION]: [
    SurveyPhase.STEP_2_SU_SURVERY,
    SurveyPhase.STEP_3_SU_EXPLORATION,
    SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    SurveyPhase.STEP_5_RESULTS,
  ],
  [SurveyPhase.STEP_4_ADDITIONAL_SURVEY]: allSurveyPhases,
  [SurveyPhase.STEP_5_RESULTS]: allSurveyPhases,
};

const verifyPhase = (currentPhase: SurveyPhase, newPhase: SurveyPhase) => {
  if (!surveyAllowedIncomingSteps[newPhase].includes(currentPhase)) {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
};

const enrichWithThresholdReached = async (
  surveyId: number,
  step: SurveyPhase,
): Promise<Partial<Survey>> => {
  if (step === SurveyPhase.STEP_3_SU_EXPLORATION) {
    const representativenessData =
      await representativenessService.representativeness(surveyId);

    return representativenessData &&
      Object.values(
        getBelowThresholdValues(representativenessData, THRESHOLD_VALUE),
      ).length === 0
      ? { thresholdReached: true }
      : {};
  }
  return {};
};

export const updateSurvey = async (id: number, data: Partial<Survey>) => {
  const existingSurvey = await db.survey.findFirst({ where: { id } });

  if (!existingSurvey) {
    throw new TRPCError({ code: "NOT_FOUND" });
  }

  let enrich: Partial<Survey> = {};
  if (data.phase && data.phase !== existingSurvey.phase) {
    verifyPhase(existingSurvey.phase, data.phase);
    enrich = await enrichWithThresholdReached(id, data.phase);
  }

  return db.survey.update({
    where: { id },
    data: { ...data, ...enrich },
  });
};

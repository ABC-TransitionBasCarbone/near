import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { ErrorCode } from "~/types/enums/error";
import {
  suAssignementRequestValidation,
  type SuDataToAssign,
} from "~/types/SuDetection";
import { type Survey, type SuData } from "@prisma/client";
import { convertToSuAnswerData } from "../external-api/convert";
import apiSuService from "../external-api/api-su";
import { type ConvertedWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";
import { type ConvertedCarbonFootprintAnswer } from "~/types/CarbonFootprint";

const getNeighborhoodSuDataToAssignOrThrows = async (
  surveyName: string,
): Promise<SuDataToAssign[]> => {
  const sus = await db.suData.findMany({
    where: { survey: { name: surveyName } },
    select: { su: true, barycenter: true },
  });

  if (!sus.length) {
    throw new TRPCError({ code: "NOT_FOUND", message: ErrorCode.SU_NOT_FOUND });
  }

  const result: SuDataToAssign[] = sus.map(({ su, barycenter }) => {
    if (
      !Array.isArray(barycenter) ||
      !barycenter.every((x) => typeof x === "number")
    ) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: ErrorCode.WRONG_BARYCENTRE_DATA,
      });
    }

    return { su, barycenter };
  });

  return result;
};

const getOneSuBySuNameOrThrows = async (
  surveyId: number,
  su: number,
): Promise<SuData> => {
  const result = await db.suData.findUnique({
    where: { surveyId_su: { surveyId, su } },
  });

  if (!result) {
    throw new TRPCError({ code: "NOT_FOUND", message: ErrorCode.SU_NOT_FOUND });
  }

  return result;
};

const getSuIdFromSuNameOrThrow = async (
  surveyId: number,
  parsedAnswer: ConvertedWayOfLifeAnswer | ConvertedCarbonFootprintAnswer,
): Promise<number> => {
  if (!parsedAnswer.su) {
    throw new TRPCError({ code: "NOT_FOUND", message: ErrorCode.SU_NOT_FOUND });
  }

  const su = await getOneSuBySuNameOrThrows(surveyId, parsedAnswer.su);

  return su.id;
};

const getCalculatedSu = async (
  survey: Survey,
  data: ConvertedWayOfLifeAnswer | ConvertedCarbonFootprintAnswer,
): Promise<{ suId: number; distanceToBarycenter: number }> => {
  const suData = await getNeighborhoodSuDataToAssignOrThrows(survey.name);

  // could throw error if schema is not valid
  const payload = suAssignementRequestValidation.parse({
    sus: suData,
    userData: convertToSuAnswerData({
      airTravelFrequency: data.airTravelFrequency!,
      digitalIntensity: data.digitalIntensity!,
      heatSource: data.heatSource!,
      meatFrequency: data.meatFrequency!,
      purchasingStrategy: data.purchasingStrategy!,
      transportationMode: data.transportationMode!,
    }),
  });

  const result = await apiSuService.assignSu(payload);

  const su = await db.suData.findUnique({
    where: { surveyId_su: { surveyId: survey.id, su: result.su } },
  });

  if (!su) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.SU_NOT_FOUND,
    });
  }

  return {
    suId: su.id,
    distanceToBarycenter: result.distanceToBarycenter,
  };
};

export const getCalculatedSuParams = async (
  survey: Survey,
  parsedAnswer: ConvertedWayOfLifeAnswer | ConvertedCarbonFootprintAnswer,
) =>
  parsedAnswer.knowSu
    ? {
        suId: await getSuIdFromSuNameOrThrow(survey.id, parsedAnswer),
      }
    : await getCalculatedSu(survey, parsedAnswer);

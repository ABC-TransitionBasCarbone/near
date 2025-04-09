import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { ErrorCode } from "~/types/enums/error";
import { type SuDataToAssign } from "~/types/SuDetection";
import { type SuData } from "@prisma/client";

export const getNeighborhoodSuDataToAssign = async (
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

export const getOneSuBySu = async (
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

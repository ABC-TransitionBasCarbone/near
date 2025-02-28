import { type SuData, type SuAnswer } from ".prisma/client";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { env } from "~/env";
import {
  type SuAssignementRequest,
  type SuAnswerDataWithId,
  type SuComputationData,
  type AnswerAttributedSu,
} from "~/types/SuDetection";
import { db } from "../db";
import { TRPCError } from "@trpc/server";
import { convertToSuAnswerData, convertToSuAnswerDataWithId } from "./convert";

export const buildSuComputationRequest = async (
  surveyId: number,
): Promise<SuAnswerDataWithId[]> => {
  const suAnswers: SuAnswer[] = await db.suAnswer.findMany({
    where: { surveyId },
  });
  return suAnswers.map((suAnswer) => convertToSuAnswerDataWithId(suAnswer));
};

export const computeSus = async (
  payload: SuAnswerDataWithId[],
): Promise<SuComputationData> => {
  try {
    const snakecasePayload = payload.map((suAnswerData: SuAnswerDataWithId) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      snakecaseKeys(suAnswerData as unknown as Record<string, unknown>),
    );

    const response = await fetch(`${env.API_SU_URL}/api-su/compute`, {
      method: "POST",
      headers: {
        "X-API-KEY": `${env.API_SU_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snakecasePayload),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const snakecaseComputedSu = await response.json();

    if (!response.ok) {
      throw new Error(
        `Status=${response.status} Content=${snakecaseComputedSu}`,
      );
    }

    const camelCaseComputedSu = camelcaseKeys(snakecaseComputedSu, {
      deep: true,
    }) as SuComputationData;

    return camelCaseComputedSu;
  } catch (error) {
    console.error("Error calling API SU compute:", error);
    if (error instanceof TypeError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Network error occurred while calling the API SU compute.",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    });
  }
};

export const buildSuAssignmentRequest = async (
  surveyId: number,
  suAnswer: SuAnswer, // TODO: update with correct type
): Promise<SuAssignementRequest> => {
  const suDatas: SuData[] = await db.suData.findMany({
    where: { surveyId },
  });
  return {
    sus: suDatas.map((suData) => {
      return { su: suData.su, barycenter: suData.barycenter as number[] };
    }),
    userData: convertToSuAnswerData(suAnswer),
  };
};

export const assignSu = async (
  payload: SuAssignementRequest,
): Promise<AnswerAttributedSu> => {
  try {
    const snakeCaseAssignRequest = snakecaseKeys(
      payload as unknown as Record<string, unknown>,
    );

    const response = await fetch(`${env.API_SU_URL}/api-su/assign`, {
      method: "POST",
      headers: {
        "X-API-KEY": `${env.API_SU_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(snakeCaseAssignRequest),
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const snakeCaseAssignResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        `Status=${response.status} Content=${snakeCaseAssignResponse}`,
      );
    }

    const camelCaseAssignResponse = camelcaseKeys(snakeCaseAssignResponse, {
      deep: true,
    }) as AnswerAttributedSu;

    return camelCaseAssignResponse;
  } catch (error) {
    console.error("Error calling API SU assign:", error);
    if (error instanceof TypeError) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Network error occurred while calling the API SU assign.",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    });
  }
};

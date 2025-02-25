import { type SuAnswer } from ".prisma/client";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import { env } from "~/env";
import { type SuAnswerData, type SuComputationData } from "~/types/SuDetection";
import { db } from "../db";
import { convert } from "./convert";
import { TRPCError } from "@trpc/server";

export const buildSuComputationRequest = async (
  surveyId: number,
): Promise<SuAnswerData[]> => {
  const suAnswers: SuAnswer[] = await db.suAnswer.findMany({
    where: { surveyId },
  });
  return suAnswers.map((suAnswer) => convert(suAnswer));
};

export const computeSus = async (
  payload: SuAnswerData[],
): Promise<SuComputationData> => {
  try {
    const snakecasePayload = payload.map((suAnswerData: SuAnswerData) =>
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
      console.error(
        "Error when calling API SU compute:",
        response.status,
        snakecaseComputedSu,
      );
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `API Error: HTTP Status=${response.status}}`,
      });
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
        message: "Network error occurred while calling the API.",
      });
    }
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    });
  }
};

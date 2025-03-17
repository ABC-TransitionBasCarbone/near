import { allSurveyTypes, SurveyType } from "~/types/enums/survey";
import { db } from "../db";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { type QualityStatistics } from "~/types/QualityStatistics";

const surveyTypeMapper: Record<
  SurveyType,
  | typeof db.carbonFootprintAnswer
  | typeof db.wayOfLifeAnswer
  | typeof db.suAnswer
> = {
  [SurveyType.CARBON_FOOTPRINT]: db.carbonFootprintAnswer,
  [SurveyType.SU]: db.suAnswer,
  [SurveyType.WAY_OF_LIFE]: db.wayOfLifeAnswer,
};

const getQualityStatistics = async (
  type: SurveyType,
  surveyId: number,
  populationSize: number,
): Promise<QualityStatistics> => {
  // @ts-expect-error fix me
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const sampleSize = (await surveyTypeMapper[type].count({
    where: { surveyId },
  })) as number;

  const p = sampleSize / populationSize;

  const confidence = 1.96;

  const correctedMarginError =
    confidence *
    Math.sqrt((p * (1 - p)) / sampleSize) *
    Math.sqrt((populationSize - sampleSize) / (populationSize - 1));

  return {
    type,
    sampleSize,
    correctedMarginError,
    confidence: 0.95,
  };
};

export const getAllQualityStatistics = async (
  surveyId: number,
): Promise<QualityStatistics[]> => {
  const neighborhood = await db.quartier.findUnique({ where: { surveyId } });

  if (!neighborhood) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.NEIGHBORHOOD_NOT_FOUND,
    });
  }

  return Promise.all(
    allSurveyTypes.map((surveyType) =>
      getQualityStatistics(surveyType, surveyId, neighborhood.population_sum),
    ),
  );
};

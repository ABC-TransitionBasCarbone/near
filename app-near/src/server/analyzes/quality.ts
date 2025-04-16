import { allSurveyTypes, SurveyType } from "~/types/enums/survey";
import { db } from "../db";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import {
  type QualityStatisticsWithPopulation,
  type QualityStatistics,
} from "~/types/QualityStatistics";

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
  const sampleSize = (await surveyTypeMapper[type].count({
    where: { surveyId },
  })) as number;

  const p = sampleSize / populationSize;

  const correctedMarginError =
    1.96 *
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
): Promise<QualityStatisticsWithPopulation> => {
  const neighborhood = await db.quartier.findUnique({ where: { surveyId } });

  if (!neighborhood) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.NEIGHBORHOOD_NOT_FOUND,
    });
  }

  const qualityStat = await Promise.all(
    allSurveyTypes.map((surveyType) =>
      getQualityStatistics(surveyType, surveyId, neighborhood.population_sum),
    ),
  );

  return {
    qualityStatistics: qualityStat,
    populationSum: neighborhood.population_sum,
    populationSumWith15: neighborhood.population_sum_with_under_fifteen,
  };
};

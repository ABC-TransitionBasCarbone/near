import { type SurveyType } from "./enums/survey";

export interface QualityStatistics {
  type: SurveyType;
  sampleSize: number;
  correctedMarginError: number;
  confidence: number;
}

export interface QualityStatisticsWithPopulation {
  qualityStatistics: QualityStatistics[];
  populationSum: number;
  populationSumWith15: number;
}

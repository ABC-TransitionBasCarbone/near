import { type SurveyType } from "./enums/survey";

export interface QualityStatistics {
  type: SurveyType;
  sampleSize: number;
  correctedMarginError: number;
  confidence: number;
}

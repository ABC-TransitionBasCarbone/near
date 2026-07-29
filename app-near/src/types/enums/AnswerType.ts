import { SurveyType } from "./survey";

export enum AnswerType {
  SU = "su",
  WAY_OF_LIFE = "way-of-life",
  CARBON_FOOTPRINT = "carbon-footprint",
}

export const mapSurveyTypeInAnswerType: Record<SurveyType, AnswerType> = {
  [SurveyType.CARBON_FOOTPRINT]: AnswerType.CARBON_FOOTPRINT,
  [SurveyType.SU]: AnswerType.SU,
  [SurveyType.WAY_OF_LIFE]: AnswerType.WAY_OF_LIFE,
};

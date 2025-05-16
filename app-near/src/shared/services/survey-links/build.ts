import {
  type BroadcastType,
  surveyTypeMapper,
} from "~/types/enums/broadcasting";
import { SurveyType } from "~/types/enums/survey";

export const buildSurveyLink = (
  broadcastType: BroadcastType,
  surveyType: SurveyType,
  surveyName?: string,
): string => {
  if (!surveyName) {
    return "error";
  }
  return `${surveyTypeMapper[surveyType].baseUrl}${surveyType == SurveyType.CARBON_FOOTPRINT ? "?" : "#"}broadcast_channel=${
    broadcastType
  }&broadcast_id=${crypto.randomUUID()}&date=${encodeURIComponent(new Date().toISOString())}&neighborhood=${encodeURI(surveyName)}`;
};

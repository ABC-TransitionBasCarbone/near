import { TRPCError } from "@trpc/server";
import { getOneNeighborhoodConfig } from "../neighborhoodConfig/get";
import {
  type BroadcastType,
  surveyTypeMapper,
} from "~/types/enums/broadcasting";
import { SurveyType } from "~/types/enums/survey";
import { ErrorCode } from "~/types/enums/error";

const neighborhoodListDirections = [
  {
    param: "north_list",
    close: "northCloseLocations",
    distant: "northDistantLocations",
  },
  {
    param: "east_list",
    close: "eastCloseLocations",
    distant: "eastDistantLocations",
  },
  {
    param: "south_list",
    close: "southCloseLocations",
    distant: "southDistantLocations",
  },
  {
    param: "west_list",
    close: "westCloseLocations",
    distant: "westDistantLocations",
  },
] as const;

const buildNeighborhoodListParams = async (
  surveyId: number,
): Promise<string> => {
  const neighborhoodConfig = await getOneNeighborhoodConfig(surveyId);
  if (!neighborhoodConfig) return "";

  return neighborhoodListDirections
    .map(({ param, close, distant }) => {
      const value = [neighborhoodConfig[close], neighborhoodConfig[distant]]
        .filter(Boolean)
        .join(", ");
      return `&${param}=${encodeURIComponent(value)}`;
    })
    .join("");
};

export const buildSurveyLink = async (
  surveyId: number,
  broadcastType: BroadcastType,
  surveyType: SurveyType,
  surveyName?: string,
): Promise<string> => {
  if (!surveyName) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: ErrorCode.MISSING_SURVEY_NAME,
    });
  }

  const neighborhoodListParams =
    surveyType === SurveyType.WAY_OF_LIFE
      ? await buildNeighborhoodListParams(surveyId)
      : "";

  return `${surveyTypeMapper[surveyType].baseUrl}${surveyType === SurveyType.CARBON_FOOTPRINT ? "?" : "#"}broadcast_channel=${
    broadcastType
  }&broadcast_id=${crypto.randomUUID()}&date=${encodeURIComponent(new Date().toISOString())}&neighborhood=${encodeURI(surveyName)}${neighborhoodListParams}`;
};

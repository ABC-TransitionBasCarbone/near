import { db } from "../db";
import { buildSurveyLink } from "./build";
import { SurveyType } from "~/types/enums/survey";
import { BroadcastType } from "~/types/enums/broadcasting";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

describe("buildSurveyLink", () => {
  const surveyId = 1;
  const surveyName = "test-survey-link";

  const fixedDate = new Date("2025-05-16T11:30:36.145Z");
  const fixedUUID = "mocked-uuid-1234";

  beforeEach(() => {
    const OriginalDate = Date;
    jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    Date.now = OriginalDate.now;

    jest.spyOn(global.crypto, "randomUUID").mockReturnValue(fixedUUID);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 'error' when surveyName is missing", async () => {
    expect.assertions(2);
    try {
      await buildSurveyLink(
        surveyId,
        BroadcastType.MAIL_CAMPAIGN,
        SurveyType.WAY_OF_LIFE,
        undefined,
      );
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toBe(ErrorCode.MISSING_SURVEY_NAME);
      }
    }
  });

  it("should build a carbon footprint link without neighborhood list params", async () => {
    const findUniqueSpy = jest.spyOn(db.neighborhoodConfig, "findUnique");

    const result = await buildSurveyLink(
      surveyId,
      BroadcastType.MAIL_CAMPAIGN,
      SurveyType.CARBON_FOOTPRINT,
      surveyName,
    );

    expect(result).toBe(
      `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
    );
    expect(findUniqueSpy).not.toHaveBeenCalled();
  });

  // this case should not appen, it is cached upstream.
  it("should build a way of life link without neighborhood list params when no neighborhood config exists", async () => {
    jest.spyOn(db.neighborhoodConfig, "findUnique").mockResolvedValue(null);

    const result = await buildSurveyLink(
      surveyId,
      BroadcastType.MAIL_CAMPAIGN,
      SurveyType.WAY_OF_LIFE,
      surveyName,
    );

    expect(result).toBe(
      `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
    );
  });

  it("should append north_list/east_list/south_list/west_list when a neighborhood config exists", async () => {
    jest.spyOn(db.neighborhoodConfig, "findUnique").mockResolvedValue({
      id: 1,
      surveyId,
      northCloseLocations: "Parc",
      northDistantLocations: "Gare",
      eastCloseLocations: "École",
      eastDistantLocations: null,
      southCloseLocations: null,
      southDistantLocations: null,
      westCloseLocations: null,
      westDistantLocations: null,
    });

    const result = await buildSurveyLink(
      surveyId,
      BroadcastType.MAIL_CAMPAIGN,
      SurveyType.WAY_OF_LIFE,
      surveyName,
    );

    expect(result).toBe(
      `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}` +
        `&north_list=${encodeURIComponent("Parc, Gare")}` +
        `&east_list=${encodeURIComponent("École")}` +
        `&south_list=` +
        `&west_list=`,
    );
  });
});

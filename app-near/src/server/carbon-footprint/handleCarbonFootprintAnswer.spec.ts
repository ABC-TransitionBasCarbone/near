/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { ErrorCode } from "~/types/enums/error";
import apiSuService from "../external-api/api-su";
import { getValideCarbonFootprintPayload } from "../test-utils/carbonFootprint";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { expectFailedPayloadIsSaved } from "../test-utils/expects/answerError";
import { buildRequest } from "../test-utils/request/buildRequest";
import { SignatureType, signPayload } from "../typeform/signature";
import { handleCarbonFootprintAnswer } from "./handleCarbonFootprintAnswer";

describe("handleCarbonFootprintAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  let survey: Survey;

  const su = 3;

  beforeEach(async () => {
    await clearAllSurveys();
    survey = await db.survey.create({
      data: { name: neighborhoodName },
    });

    await db.suData.create({
      data: {
        barycenter: [1, 2, 3, 4],
        popPercentage: 0.3,
        su,
        surveyId: survey.id,
      },
    });

    jest.spyOn(apiSuService, "assignSu").mockReturnValue(
      Promise.resolve({
        distanceToBarycenter: 1234,
        su,
      }),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 when wrong body", async () => {
    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest({ body: "wrong-body" }, "signature"),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid payload");
    await expectFailedPayloadIsSaved({ body: "wrong-body" });
  });

  it("should return 401 when signature is invalid", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, "wrong-signature"),
    );
    expect(await response.text()).toContain("Not authorized");
    expect(response.status).toBe(401);
    const data = await db.rawAnswerError.findMany();
    expect(data.length).toBe(0);
  });

  it("should return 400 when transformed data is invalid", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    // @ts-expect-error pas string rather than number for test purpose
    payload.calculatedResults.alimentation = "should be number";
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid payload");
    await expectFailedPayloadIsSaved(payload);
  });

  it("should return 404 when no survey found by name", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    payload.neighborhoodId = "unknown";
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.code).toBe("NOT_FOUND");
    expect(body.message).toBe(ErrorCode.WRONG_SURVEY_NAME);
    await expectFailedPayloadIsSaved(payload);
  });

  it("should return 201 when su is unkown", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const payload = getValideCarbonFootprintPayload(neighborhoodName);
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");

    const data = await db.carbonFootprintAnswer.findMany({
      include: { su: true },
    });

    expect(data.length).toBe(1);
    expect(data[0]?.su?.su).toBe(su);
  });

  it("should return 201 when su is known", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const suId = 1;
    const suNameFromNGC = "SU 1";
    await db.suData.create({
      data: {
        barycenter: [0, 1, 3, 6],
        popPercentage: 0.11,
        su: suId,
        surveyId: survey.id,
      },
    });

    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      suNameFromNGC,
    );
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");

    const data = await db.carbonFootprintAnswer.findMany({
      include: { su: true },
    });

    expect(data.length).toBe(1);
    expect(data[0]?.su?.su).toBe(suId);
  });

  it("should return 400 when neighborhood is not defined", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    payload.neighborhoodId = "";
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.code).toBe("BAD_REQUEST");
    expect(body.message).toBe(ErrorCode.MISSING_SURVEY_NAME);
    await expectFailedPayloadIsSaved(payload);
  });

  it("should return 404 when calculated su is not found", async () => {
    jest.spyOn(apiSuService, "assignSu").mockReturnValue(
      Promise.resolve({
        distanceToBarycenter: 1234,
        su: 19, // su not existing in db
      }),
    );

    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const payload = getValideCarbonFootprintPayload(neighborhoodName);
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toContain("SU_NOT_FOUND");

    const data = await db.carbonFootprintAnswer.findMany({
      include: { su: true },
    });

    expect(data.length).toBe(0);

    await expectFailedPayloadIsSaved(payload);
  });
});

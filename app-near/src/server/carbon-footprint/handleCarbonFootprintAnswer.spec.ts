/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { ErrorCode } from "~/types/enums/error";
import { handleCarbonFootprintAnswer } from "./handleCarbonFootprintAnswer";
import { buildRequest } from "../test-utils/request/buildRequest";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { getValideCarbonFootprintPayload } from "../test-utils/carbonFootprint";
import { SignatureType, signPayload } from "../typeform/signature";
import apiSuService from "../external-api/api-su";

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
  });

  it("should return 401 when signature is invalid", async () => {
    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(
        getValideCarbonFootprintPayload(survey.name),
        "wrong-signature",
      ),
    );
    expect(await response.text()).toContain("Not authorized");
    expect(response.status).toBe(401);
  });

  it("should return 400 when transformed data is invalid", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    // @ts-expect-error pas string rather than number for test purpose
    payload.calculatedResults.alimentation = "should be nuumber";
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
  });

  it("should return 404 when no survey found by name", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    payload.answers.neighborhood = "unknown";
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
  });

  it("should return 400 when neighborhood is not defined", async () => {
    const payload = getValideCarbonFootprintPayload(neighborhoodName);

    payload.answers.neighborhood = "";
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
  });

  it("should return 201 when know su is false", async () => {
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

  it("should return 201 when know su is true", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const suName = 11;
    await db.suData.create({
      data: {
        barycenter: [0, 1, 3, 6],
        popPercentage: 0.11,
        su: suName,
        surveyId: survey.id,
      },
    });

    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      suName,
      true,
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
    expect(data[0]?.su?.su).toBe(suName);
  });

  it("should return 404 when input su is not found", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const suName = 11;
    await db.suData.create({
      data: {
        barycenter: [0, 1, 3, 6],
        popPercentage: 0.11,
        su: suName,
        surveyId: survey.id,
      },
    });

    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      1111, // not existing su
      true,
    );
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
  });
});

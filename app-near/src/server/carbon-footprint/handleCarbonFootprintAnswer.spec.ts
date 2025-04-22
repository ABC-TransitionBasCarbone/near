/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { ErrorCode } from "~/types/enums/error";
import EmailService from "~/server/email";
import { TemplateId } from "~/types/enums/brevo";
import { handleCarbonFootprintAnswer } from "./handleCarbonFootprintAnswer";
import { buildRequest } from "../test-utils/request/buildRequest";
import { buildCarbonFootprintAnswer } from "../test-utils/create-data/carbonFootprintAnswer";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { getValideCarbonFootprintPayload } from "../test-utils/carbonFootprint";
import { SignatureType, signPayload } from "../typeform/signature";

describe("handleCarbonFootprintAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  let survey: Survey;

  let sendEmailMock: jest.SpyInstance;

  beforeEach(async () => {
    await clearAllSurveys();
    survey = await db.survey.create({
      data: { name: neighborhoodName },
    });

    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));
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
        getValideCarbonFootprintPayload(neighborhoodName, "email@mail.com"),
        "wrong-signature",
      ),
    );
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Not authorized");
  });

  it("should return 400 when transformed data is invalid", async () => {
    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      "email@mail.com",
    );

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
    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      "email@mail.com",
    );
    payload.neighborhood = "unknown";
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

    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should return 400 when neighborhood is not defined", async () => {
    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      "email@mail.com",
    );
    payload.neighborhood = "";
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
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should return 201 and send email", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });
    const suId = 2;
    await db.suData.create({
      data: {
        id: suId,
        barycenter: 0.1,
        popPercentage: 0.11,
        su: 11,
        surveyId: survey.id,
      },
    });

    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      "random@mail.com",
      suId,
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
    expect(sendEmailMock).toHaveBeenCalledWith({
      params: { displayCarbonFootprint: "false", displayWayOfLife: "true" },
      templateId: TemplateId.PHASE_2_NOTIFICATION,
      to: [{ email: "random@mail.com" }],
    });
  });

  it("should return 201 and send email when email already exists", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const suId = 2;
    await db.suData.create({
      data: {
        id: suId,
        barycenter: 0.1,
        popPercentage: 0.11,
        su: 11,
        surveyId: survey.id,
      },
    });

    await db.carbonFootprintAnswer.create({
      // @ts-expect-error unexepted typescript error for answers
      data: buildCarbonFootprintAnswer(survey.id, suId, {
        email: "random@mail.com",
      }),
    });

    const payload = getValideCarbonFootprintPayload(
      neighborhoodName,
      "random@mail.com",
      suId,
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
    expect(sendEmailMock).toHaveBeenCalledWith({
      params: { displayCarbonFootprint: "false", displayWayOfLife: "true" },
      templateId: TemplateId.PHASE_2_NOTIFICATION,
      to: [{ email: "random@mail.com" }],
    });
  });

  it("should return 201 when email is empty and empty email already exist", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const suId = 2;
    await db.suData.create({
      data: {
        id: suId,
        barycenter: 0.1,
        popPercentage: 0.11,
        su: 11,
        surveyId: survey.id,
      },
    });

    await db.carbonFootprintAnswer.createMany({
      data: [
        // @ts-expect-error unexepted typescript error for answers
        buildCarbonFootprintAnswer(survey.id, suId),
        // @ts-expect-error unexepted typescript error for answers
        buildCarbonFootprintAnswer(survey.id, suId, { email: null }),
        // @ts-expect-error unexepted typescript error for answers
        buildCarbonFootprintAnswer(survey.id, suId, { email: "" }),
        // @ts-expect-error unexepted typescript error for answers
        buildCarbonFootprintAnswer(survey.id, suId, { email: undefined }),
      ],
    });

    const payload = getValideCarbonFootprintPayload(neighborhoodName, "", suId);
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
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

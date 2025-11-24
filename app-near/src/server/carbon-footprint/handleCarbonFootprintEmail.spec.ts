import { handleCarbonFootprintEmail } from "./handleCarbonFootprintEmail";
import { buildRequest } from "../test-utils/request/buildRequest";
import { signPayload } from "../typeform/signature";
import { SignatureType } from "../typeform/signature";
import { db } from "../db";
import EmailService from "../email";
import { clearAlldata } from "../test-utils/clear";
import crypto from "crypto";
import { buildCarbonFootprintAnswer } from "../test-utils/create-data/carbonFootprintAnswer";
import { createNeighborhood } from "../test-utils/create-data/neighborhood";
import { type Survey } from "@prisma/client";
import { TemplateId } from "~/types/enums/brevo";
import { env } from "~/env";

describe("handleCarbonFootprintEmail", () => {
  const email = "email@mail.com";
  const externalId = crypto.randomUUID();

  let survey: Survey;
  const surveyName = "test-ngc-email";

  const fixedDate = new Date("2025-05-16T11:30:36.145Z");
  const fixedUUID = "mocked-uuid-1234";

  let sendEmailMock: jest.SpyInstance;

  beforeEach(async () => {
    await clearAlldata();
    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));

    survey = await createNeighborhood(surveyName);

    await db.suData.createMany({
      data: [
        {
          id: 1,
          surveyId: survey.id,
          barycenter: [1, 2, 3],
          popPercentage: 0.11,
          su: 1,
        },
        {
          id: 2,
          surveyId: survey.id,
          barycenter: [2, 3, 4],
          popPercentage: 0.22,
          su: 2,
        },
      ],
    });

    await db.carbonFootprintAnswer.create({
      // @ts-expect-error allow for test
      data: buildCarbonFootprintAnswer(survey.id, { externalId, suId: 1 }),
    });

    const OriginalDate = Date;
    jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    Date.now = OriginalDate.now;

    jest.spyOn(global.crypto, "randomUUID").mockReturnValue(fixedUUID);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return 400 when wrong body", async () => {
    const payload = { email: "wrong-email" };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid request body");
  });

  it("should return 401 when signature is invalid", async () => {
    const payload = { email, id: externalId };

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, "wrong-signature"),
    );

    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Not authorized");
  });

  it("should update email and return 200 when email is new", async () => {
    const payload = { email, id: externalId };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Email processed");

    const answer = await db.carbonFootprintAnswer.findUnique({
      where: { externalId },
    });
    expect(answer).toBeTruthy();
    expect(answer?.email).toBe(email);
    expect(sendEmailMock).toHaveBeenCalledWith({
      params: {
        displayCarbonFootprint: "false",
        displayWayOfLife: "true",
        neighborhood: surveyName,
        ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
        suName: "1",
        wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
      },
      subject: `Petite enquête ${surveyName} : merci d'avoir répondu ! Et la suite ?`,
      templateId: TemplateId.PHASE_2_NOTIFICATION,
      to: [{ email }],
    });
  });

  it("should return 200 if email already exists", async () => {
    await db.carbonFootprintAnswer.update({
      data: { email },
      where: { externalId },
    });

    const payload = { email, id: externalId };
    const signature = signPayload(
      JSON.stringify(payload),
      SignatureType.NGC_FORM,
    );

    const response = await handleCarbonFootprintEmail(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain("Email processed");

    const answer = await db.carbonFootprintAnswer.findUnique({
      where: { externalId },
    });
    expect(answer).toBeTruthy();
    expect(answer?.email).toBe(email);

    expect(sendEmailMock).toHaveBeenCalledWith({
      params: {
        displayCarbonFootprint: "false",
        displayWayOfLife: "true",
        neighborhood: surveyName,
        ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
        suName: "1",
        wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
      },
      subject: `Petite enquête ${surveyName} : merci d'avoir répondu ! Et la suite ?`,
      templateId: TemplateId.PHASE_2_NOTIFICATION,
      to: [{ email }],
    });
  });
});

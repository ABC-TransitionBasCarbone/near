import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { handleAnswer } from "./handleAnswer";
import { signPayload } from "./signature";
import { db } from "../db";
import { BroadcastChannel, SurveyPhase } from "@prisma/client";
import { type TypeformWebhookPayload } from "~/types/typeform";

describe("handleAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  beforeEach(async () => {
    await db.suAnswer.deleteMany();
    await db.suData.deleteMany();
    await db.survey.deleteMany();
    await db.survey.create({
      data: { name: neighborhoodName },
    });
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildRequest = (payload: any, signature: string) => ({
    text: async () => JSON.stringify(payload),
    headers: {
      get: () => signature,
    },
  });

  it("should return 400 when wrong body", async () => {
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest({ body: "wrong-body" }, "signature"),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid payload");
  });

  it("should return 401 when signature is invalid", async () => {
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(valideSuSurveyPayload, "wrong-signature"),
    );
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Not authorized");
  });

  it("should return 404 when no survey found by name", async () => {
    // Arrange
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    payload.form_response.hidden = {
      neighborhood: "unknown",
    };
    const signature = signPayload(JSON.stringify(payload));

    // Act
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    // Assert
    expect(response.status).toBe(404);
    expect(await response.text()).toContain(`Survey name unknown not found`);
  });

  it("should return 400 when transformed data is invalid", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    payload.form_response.answers.splice(2, 2);
    const signature = signPayload(JSON.stringify(payload));

    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(400);
    // expect(await response.text()).toContain("Invalid payload");
  });

  it("should return 400 when reference mapping is invalid", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    payload.form_response.form_id = "unknown";

    const signature = signPayload(JSON.stringify(payload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("References mapping not found");
  });

  it("should return 400 when neighborhood is not defined", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signature = signPayload(JSON.stringify(valideSuSurveyPayload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(valideSuSurveyPayload, signature),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Survey name not found");
  });

  it("should return 200 when user as less than 15", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    // @ts-expect-error allowed for test
    payload.form_response.answers[1].choice = {
      id: "quEgbNpyxmlD",
      ref: "a403515c-5a86-4c4b-a842-bae699a09f47",
      label: "Moins de 15 ans",
    };

    const signature = signPayload(JSON.stringify(payload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("user should be under 15");
  });

  it(`should return 200 when not in ${SurveyPhase.STEP_2_SU_SURVERY}`, async () => {
    // Arrange
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_3_SU_EXPLORATION },
      where: { name: neighborhoodName },
    });

    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    payload.form_response.hidden = {
      neighborhood: neighborhoodName,
      broadcast_channel: BroadcastChannel.mail_campaign,
    };
    const signature = signPayload(JSON.stringify(payload));

    // Act
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );

    // Assert
    expect(response.status).toBe(200);
    expect(await response.text()).toContain(
      `step ${SurveyPhase.STEP_2_SU_SURVERY} is over for ${neighborhoodName}`,
    );
  });

  it("should return 200 when user is not resident", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    // @ts-expect-error allowed for test
    payload.form_response.answers[0].choice = {
      id: "fugWMOloSfDA",
      ref: "3a347ad6-7461-4549-8cf3-d45167702a74",
      label: "Non",
    };

    const signature = signPayload(JSON.stringify(payload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("user should live in neighborhood");
  });

  it("should return 201", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_2_SU_SURVERY },
      where: { name: neighborhoodName },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(
      JSON.stringify(valideSuSurveyPayload),
    ) as TypeformWebhookPayload;

    payload.form_response.hidden = {
      neighborhood: neighborhoodName,
      broadcast_channel: BroadcastChannel.mail_campaign,
    };
    const signature = signPayload(JSON.stringify(payload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
  });
});

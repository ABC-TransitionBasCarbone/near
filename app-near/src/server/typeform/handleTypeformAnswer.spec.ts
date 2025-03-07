import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { handleTypeformAnswer } from "./handleTypeformAnswer";
import { signPayload } from "./signature";
import { db } from "../db";
import { type TypeformWebhookPayload } from "~/types/Typeform";
import { buildRequest } from "../test-utils/request/buildRequest";
import { BroadcastChannel, SurveyPhase } from "@prisma/client";
import { valideWayOfLifeSurveyPayload } from "../test-utils/wayOfLifeSurvey";
import { clearAllSurveys } from "../test-utils/clear/survey";

describe("handleAnswer", () => {
  beforeEach(async () => {
    await clearAllSurveys();
  });

  describe("errors", () => {
    it("should return 400 when wrong body", async () => {
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest({ body: "wrong-body" }, "signature"),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("Invalid payload");
    });

    it("should return 401 when signature is invalid", async () => {
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(valideSuSurveyPayload, "wrong-signature"),
      );
      expect(response.status).toBe(401);
      expect(await response.text()).toContain("Not authorized");
    });

    it("should return 400 when transformed data is invalid", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.answers.splice(2, 2);
      const signature = signPayload(JSON.stringify(payload));

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("Invalid payload");
    });

    it("should return 400 when reference mapping is invalid", async () => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.form_id = "unknown";

      const signature = signPayload(JSON.stringify(payload));
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("References mapping not found");
    });
  });

  describe("suAnswers", () => {
    it("should return 201 for suAnswer", async () => {
      const neighborhoodName = "neighborhood_test";
      await db.survey.create({
        data: { name: neighborhoodName },
      });

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
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");
    });
  });

  // TODO NEAR-45 : update valideWayOfLifeSurveyPayload
  describe("wayOfLifeAnswers", () => {
    it("should return 201 for wayOfLifeAnswer", async () => {
      const neighborhoodName = "neighborhood_test";
      await db.survey.create({
        data: { name: neighborhoodName },
      });

      await db.survey.update({
        data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = JSON.parse(
        JSON.stringify(valideWayOfLifeSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
      };
      const signature = signPayload(JSON.stringify(payload));
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");
    });
  });
});

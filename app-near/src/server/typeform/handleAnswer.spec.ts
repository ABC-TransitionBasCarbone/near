import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { handleAnswer } from "./handleAnswer";
import { signPayload } from "./signature";
import { db } from "../db";
import { type TypeformWebhookPayload } from "~/types/typeform";
import { buildRequest } from "../test-utils/request/buildRequest";
import { BroadcastChannel, SurveyPhase } from "@prisma/client";

describe("handleAnswer", () => {
  beforeEach(async () => {
    await db.suAnswer.deleteMany();
    await db.suData.deleteMany();
    await db.survey.deleteMany();
  });

  describe("errors", () => {
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
      const response = await handleAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");
    });
  });
});

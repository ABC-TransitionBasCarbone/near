import {
  AnswerErrorStatus,
  BroadcastChannel,
  ProfessionalCategory,
  ProfessionalSituation,
  SurveyPhase,
  type Survey,
} from "@prisma/client";
import { TemplateId } from "~/types/enums/brevo";
import { ErrorCode } from "~/types/enums/error";
import { TypeformType, type TypeformWebhookPayload } from "~/types/Typeform";
import { db } from "../db";
import EmailService from "../email";
import apiSuService from "../external-api/api-su";
import { clearAlldata } from "../test-utils/clear";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";
import { buildRequest } from "../utils/buildRequest";
import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { valideWayOfLifeSurveyPayload } from "../test-utils/wayOfLifeSurvey";
import { handleTypeformAnswer } from "./handleTypeformAnswer";
import { getValidSurveyPhase } from "./helpers";
import { SignatureType, signPayload } from "./signature";
import {
  expectFailedPayloadIsNotSaved,
  expectFailedPayloadIsSaved,
} from "../test-utils/expects/answerError";
import { env } from "~/env";

describe("handleAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  const broadcastId = "54a325c3-7a07-4b17-8eaf-c8fd1683b78e";
  const su = 3;
  let survey: Survey;

  let sendEmailMock: jest.SpyInstance;
  let apiSuServiceMock: jest.SpyInstance;

  const fixedDate = new Date("2025-05-16T11:30:36.145Z");
  const fixedUUID = "mocked-uuid-1234";

  beforeEach(async () => {
    await clearAlldata();
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

    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));

    apiSuServiceMock = jest.spyOn(apiSuService, "assignSu").mockReturnValue(
      Promise.resolve({
        distanceToBarycenter: 1234,
        su: 3,
      }),
    );

    const OriginalDate = Date;
    jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    Date.now = OriginalDate.now;

    jest.spyOn(global.crypto, "randomUUID").mockReturnValue(fixedUUID);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("errors", () => {
    it("should return 400 when wrong body", async () => {
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest({ body: "wrong-body" }, "signature"),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("Invalid payload");

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved({ body: "wrong-body" });
    });

    it("should return 400 when formId is invalid", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.form_id = "unknown";

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain(ErrorCode.WRONG_FORM_ID);

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(payload);
    });

    it("should return 401 when signature is invalid", async () => {
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(valideSuSurveyPayload, "wrong-signature"),
      );
      expect(response.status).toBe(401);
      expect(await response.text()).toContain("UNAUTHORIZED");

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(valideSuSurveyPayload);
    });

    it("should return 400 when transformed data is invalid", async () => {
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.answers.splice(2, 2);

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("Invalid payload");

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(payload);
    });

    it("should return 400 when their is no survey name", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden.neighborhood = "";

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain(ErrorCode.MISSING_SURVEY_NAME);

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(payload);
    });

    it("should return 404 when no survey found by name", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden.neighborhood = "unknown";
      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(404);
      expect(await response.text()).toContain(ErrorCode.WRONG_SURVEY_NAME);

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(payload);
    });

    it("should throw zod exception when data is not valid", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      // @ts-expect-error allow for test
      payload.form_response.answers[12].email = "wrong-email";
      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(400);
      expect(await response.text()).toContain("Invalid email");

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsSaved(payload);
    });

    it("should return 200 when user as less than 15", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      // @ts-expect-error allow for test
      payload.form_response.answers[1].choice.ref = "not-valid-ref";
      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(200);
      expect(await response.text()).toContain("user should not be under 15");

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsNotSaved();
    });

    it("should return 200 when user is not resident", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      // @ts-expect-error allow for test
      payload.form_response.answers[0].choice.ref =
        "3a347ad6-7461-4549-8cf3-d45167702a74"; // change the ref to negative answer
      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(200);
      expect(await response.text()).toContain(
        "user should live in neighborhood",
      );

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsNotSaved();
    });

    it("should return 200 with current and valid phases when SU survey is not in a valid phase", async () => {
      await db.survey.update({
        data: { phase: SurveyPhase.STEP_3_SU_EXPLORATION },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain(
        `survey ${neighborhoodName} is in phase ${SurveyPhase.STEP_3_SU_EXPLORATION}`,
      );
      expect(text).toContain(
        `valid phases are: ${SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION}, ${SurveyPhase.STEP_2_SU_SURVERY}`,
      );

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsNotSaved();
    });

    it("should not create a duplicate error row when the same payload fails again (Typeform retry)", async () => {
      await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(valideSuSurveyPayload, "wrong-signature"),
      );
      await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(valideSuSurveyPayload, "wrong-signature"),
      );

      const data = await db.rawAnswerError.findMany();
      expect(data.length).toBe(1);
      expect(data[0]?.retryCount).toBe(1);
      expect(data[0]?.externalId).toBe(
        valideSuSurveyPayload.form_response.token,
      );
    });
  });

  describe.each(Object.values(TypeformType))("When %s", (typeformType) => {
    const validSurveyPayload =
      typeformType === TypeformType.SU
        ? valideSuSurveyPayload
        : valideWayOfLifeSurveyPayload;
    const validSurveyPhase = getValidSurveyPhase(typeformType);
    const buildData =
      typeformType === TypeformType.SU ? buildSuAnswer : buildWayOfLifeAnswer;
    const model =
      typeformType === TypeformType.SU ? db.suAnswer : db.wayOfLifeAnswer;

    const replaceEmail = (
      object: TypeformWebhookPayload,
      newEmail: string,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.map(
          (answer) => {
            if (answer.type === "email") {
              return {
                ...answer,
                email: newEmail,
              };
            }
            return answer;
          },
        );
      }
      return object;
    };

    const replaceSu = (
      object: TypeformWebhookPayload,
      su: number,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.map(
          (answer) => {
            if (answer.field.ref === "su") {
              return {
                ...answer,
                number: su,
              };
            }
            return answer;
          },
        );
      }
      return object;
    };

    const deleteRefAnswer = (
      object: TypeformWebhookPayload,
      ref: string,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.filter(
          (answer) => answer.field.ref !== ref,
        );
      }
      return object;
    };

    it("should return 201", async () => {
      await db.survey.update({
        data: { phase: validSurveyPhase },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(validSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceSu(payload, su);

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");
      await expectFailedPayloadIsNotSaved();

      if (typeformType === TypeformType.WAY_OF_LIFE) {
        expect(apiSuServiceMock).toHaveBeenCalledWith({
          sus: [
            {
              barycenter: [1, 2, 3, 4],
              su: 3,
            },
          ],
          userData: {
            airTravelFrequency: 1,
            digitalIntensity: 1,
            heatSource: 1,
            meatFrequency: 1,
            purchasingStrategy: 3,
            transportationMode: 3,
          },
        });

        expect(sendEmailMock).toHaveBeenCalledWith({
          params: {
            displayCarbonFootprint: "true",
            displayWayOfLife: "false",
            neighborhood: neighborhoodName,
            ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
            suName: "3",
            wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
          },
          subject: `Petite enquête ${neighborhoodName} : merci d'avoir répondu ! Et la suite ?`,
          templateId: TemplateId.PHASE_2_NOTIFICATION,
          to: [{ email: "an_account@example.com" }],
        });
      } else {
        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(apiSuServiceMock).not.toHaveBeenCalled();
      }
    });

    it("should not create a duplicate when replayed with the same payload", async () => {
      await db.survey.update({
        data: { phase: validSurveyPhase },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(validSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceSu(payload, su);

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );

      const firstResponse = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      const secondResponse = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );

      expect(firstResponse.status).toBe(201);
      expect(secondResponse.status).toBe(201);

      // @ts-expect-error model is a union of two incompatible Prisma delegates
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await model.findMany();
      expect(data.length).toBe(1);
    });

    it("should resolve a previous error for the same payload once a retry succeeds", async () => {
      await db.survey.update({
        data: { phase: validSurveyPhase },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(validSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceSu(payload, su);

      // first attempt fails (simulates a Typeform-side transient failure)
      await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, "wrong-signature"),
      );

      const errorsBefore = await db.rawAnswerError.findMany();
      expect(errorsBefore.length).toBe(1);
      expect(errorsBefore[0]?.status).toBe(AnswerErrorStatus.ACTIVE);

      // Typeform retries the same event and it succeeds this time
      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );

      expect(response.status).toBe(201);

      const errorsAfter = await db.rawAnswerError.findMany();
      expect(errorsAfter.length).toBe(1);
      expect(errorsAfter[0]?.status).toBe(AnswerErrorStatus.RESOLVED);
      expect(errorsAfter[0]?.comment).toBeTruthy();
    });

    it("should return 201 for suAnswer when email already exist", async () => {
      // @ts-expect-error allow for test
      await model.create({
        data: buildData(survey.id, { email: "test@mail.com" }),
      });

      await db.survey.update({
        data: { phase: validSurveyPhase },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(validSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceEmail(payload, "test@mail.com");
      payload = replaceSu(payload, su);

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");

      if (typeformType === TypeformType.WAY_OF_LIFE) {
        expect(apiSuServiceMock).toHaveBeenCalledWith({
          sus: [
            {
              barycenter: [1, 2, 3, 4],
              su: 3,
            },
          ],
          userData: {
            airTravelFrequency: 1,
            digitalIntensity: 1,
            heatSource: 1,
            meatFrequency: 1,
            purchasingStrategy: 3,
            transportationMode: 3,
          },
        });

        expect(sendEmailMock).toHaveBeenCalledWith({
          params: {
            displayCarbonFootprint: "true",
            displayWayOfLife: "false",
            neighborhood: neighborhoodName,
            ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
            suName: "3",
            wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
          },
          subject: `Petite enquête ${neighborhoodName} : merci d'avoir répondu ! Et la suite ?`,
          templateId: TemplateId.PHASE_2_NOTIFICATION,
          to: [{ email: "test@mail.com" }],
        });
      } else {
        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(apiSuServiceMock).not.toHaveBeenCalled();
      }
    });

    it("should return 201 when email is empty and empty email already exist", async () => {
      // @ts-expect-error allow for test
      await model.createMany({
        data: [
          buildData(survey.id),
          buildData(survey.id, { email: null }),
          buildData(survey.id, { email: "" }),
          buildData(survey.id, { email: undefined }),
        ],
      });

      await db.survey.update({
        data: { phase: validSurveyPhase },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(validSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = deleteRefAnswer(payload, "email");
      payload = replaceSu(payload, su);

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );
      expect(response.status).toBe(201);
      expect(await response.text()).toContain("created");

      if (typeformType === TypeformType.WAY_OF_LIFE) {
        expect(apiSuServiceMock).toHaveBeenCalledWith({
          sus: [
            {
              barycenter: [1, 2, 3, 4],
              su: 3,
            },
          ],
          userData: {
            airTravelFrequency: 1,
            digitalIntensity: 1,
            heatSource: 1,
            meatFrequency: 1,
            purchasingStrategy: 3,
            transportationMode: 3,
          },
        });
      } else {
        expect(apiSuServiceMock).not.toHaveBeenCalled();
      }

      expect(sendEmailMock).not.toHaveBeenCalled();
      await expectFailedPayloadIsNotSaved();
    });

    if (typeformType === TypeformType.WAY_OF_LIFE) {
      it("should return 404 when su not found", async () => {
        await db.survey.update({
          data: { phase: validSurveyPhase },
          where: { name: neighborhoodName },
        });

        await db.suData.deleteMany();

        // eslint-disable-next-line
        let payload = JSON.parse(
          JSON.stringify(validSurveyPayload),
        ) as TypeformWebhookPayload;

        payload.form_response.hidden = {
          neighborhood: neighborhoodName,
          broadcast_channel: BroadcastChannel.mail_campaign,
          broadcast_id: broadcastId,
        };

        payload = replaceSu(payload, su);

        const signature = signPayload(
          JSON.stringify(payload),
          SignatureType.TYPEFORM,
        );
        const response = await handleTypeformAnswer(
          // @ts-expect-error allow partial for test
          buildRequest(payload, signature),
        );

        expect(response.status).toBe(404);
        expect(await response.text()).toContain("SU_NOT_FOUND");
      });

      it("should return 404 when returned su is not found", async () => {
        jest.spyOn(apiSuService, "assignSu").mockReturnValue(
          Promise.resolve({
            distanceToBarycenter: 1234,
            su: 19,
          }),
        );

        await db.survey.update({
          data: { phase: validSurveyPhase },
          where: { name: neighborhoodName },
        });

        // eslint-disable-next-line
        let payload = JSON.parse(
          JSON.stringify(validSurveyPayload),
        ) as TypeformWebhookPayload;

        payload.form_response.hidden = {
          neighborhood: neighborhoodName,
          broadcast_channel: BroadcastChannel.mail_campaign,
          broadcast_id: broadcastId,
        };

        payload = replaceSu(payload, su);

        const signature = signPayload(
          JSON.stringify(payload),
          SignatureType.TYPEFORM,
        );
        const response = await handleTypeformAnswer(
          // @ts-expect-error allow partial for test
          buildRequest(payload, signature),
        );

        expect(response.status).toBe(404);
        expect(await response.text()).toContain("SU_NOT_FOUND");
        await expectFailedPayloadIsSaved(payload);
      });

      it("should create data when unknown su", async () => {
        const unknownSu = 456852;
        const unknownSuData = await db.suData.create({
          data: {
            barycenter: [1, 2, 3, 4],
            popPercentage: 0.3,
            su: unknownSu,
            surveyId: survey.id,
          },
        });

        jest.spyOn(apiSuService, "assignSu").mockReturnValue(
          Promise.resolve({
            distanceToBarycenter: 1234,
            su: unknownSu,
          }),
        );

        await db.survey.update({
          data: { phase: validSurveyPhase },
          where: { name: neighborhoodName },
        });

        // eslint-disable-next-line
        let payload = JSON.parse(
          JSON.stringify(validSurveyPayload),
        ) as TypeformWebhookPayload;

        payload.form_response.hidden = {
          neighborhood: neighborhoodName,
          broadcast_channel: BroadcastChannel.mail_campaign,
          broadcast_id: broadcastId,
        };

        payload = deleteRefAnswer(payload, "su");

        const signature = signPayload(
          JSON.stringify(payload),
          SignatureType.TYPEFORM,
        );
        const response = await handleTypeformAnswer(
          // @ts-expect-error allow partial for test
          buildRequest(payload, signature),
        );

        expect(response.status).toBe(201);
        expect(await response.text()).toContain("created");

        expect(sendEmailMock).toHaveBeenCalledWith({
          params: {
            displayCarbonFootprint: "true",
            displayWayOfLife: "false",
            neighborhood: neighborhoodName,
            ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
            suName: "456852",
            wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${neighborhoodName}`,
          },
          subject: `Petite enquête ${neighborhoodName} : merci d'avoir répondu ! Et la suite ?`,
          templateId: TemplateId.PHASE_2_NOTIFICATION,
          to: [{ email: "an_account@example.com" }],
        });

        const createdData = await db.wayOfLifeAnswer.findMany();

        expect(createdData.length).toBe(1);
        expect(createdData[0]?.suId).toBe(unknownSuData.id);
        // TODO : should not saved failed
      });
    }
  });

  describe("SU - professionalCategory mapping from professionalSituation", () => {
    const replaceChoiceRef = (
      object: TypeformWebhookPayload,
      fieldRef: string,
      newChoiceRef: string,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.map(
          (answer) => {
            if (answer.field.ref === fieldRef && answer.type === "choice") {
              return {
                ...answer,
                choice: { ...answer.choice, ref: newChoiceRef },
              };
            }
            return answer;
          },
        );
      }
      return object;
    };

    const removeAnswerByRef = (
      object: TypeformWebhookPayload,
      ref: string,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.filter(
          (answer) => answer.field.ref !== ref,
        );
      }
      return object;
    };

    it("should map RETIRED professionalSituation to CS7", async () => {
      await db.survey.update({
        data: { phase: getValidSurveyPhase(TypeformType.SU) },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceChoiceRef(
        payload,
        "professionalSituation",
        "27df4f5b-329d-450e-925e-0955af8e50b8", // RETIRED
      );
      payload = removeAnswerByRef(payload, "professionalCategory");

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );

      expect(response.status).toBe(201);
      const savedAnswers = await db.suAnswer.findMany();
      expect(savedAnswers[0]?.professionalCategory).toBe(
        ProfessionalCategory.CS7,
      );
      expect(savedAnswers[0]?.professionalSituation).toBe(
        ProfessionalSituation.RETIRED,
      );
    });

    it("should map STUDENT professionalSituation to CS8_student", async () => {
      await db.survey.update({
        data: { phase: getValidSurveyPhase(TypeformType.SU) },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = replaceChoiceRef(
        payload,
        "professionalSituation",
        "46f3df0a-8c10-4ef2-844b-bf80d02b224f", // STUDENT
      );
      payload = removeAnswerByRef(payload, "professionalCategory");

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );

      expect(response.status).toBe(201);
      const savedAnswers = await db.suAnswer.findMany();
      expect(savedAnswers[0]?.professionalCategory).toBe(
        ProfessionalCategory.CS8_student,
      );
      expect(savedAnswers[0]?.professionalSituation).toBe(
        ProfessionalSituation.STUDENT,
      );
    });
  });

  describe("SU - easyHealthAccess optional", () => {
    const removeAnswerByRef = (
      object: TypeformWebhookPayload,
      ref: string,
    ): TypeformWebhookPayload => {
      if (
        object?.form_response &&
        Array.isArray(object.form_response.answers)
      ) {
        object.form_response.answers = object.form_response.answers.filter(
          (answer) => answer.field.ref !== ref,
        );
      }
      return object;
    };

    it("should return 201 and save a null easyHealthAccess when not answered", async () => {
      await db.survey.update({
        data: { phase: getValidSurveyPhase(TypeformType.SU) },
        where: { name: neighborhoodName },
      });

      // eslint-disable-next-line
      let payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      payload.form_response.hidden = {
        neighborhood: neighborhoodName,
        broadcast_channel: BroadcastChannel.mail_campaign,
        broadcast_id: broadcastId,
      };

      payload = removeAnswerByRef(payload, "easyHealthAccess");

      const signature = signPayload(
        JSON.stringify(payload),
        SignatureType.TYPEFORM,
      );
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(payload, signature),
      );

      expect(response.status).toBe(201);
      const savedAnswers = await db.suAnswer.findMany();
      expect(savedAnswers[0]?.easyHealthAccess).toBeNull();
    });
  });
});

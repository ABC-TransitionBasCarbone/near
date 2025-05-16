import { BroadcastChannel, type Survey } from "@prisma/client";
import { TemplateId } from "~/types/enums/brevo";
import { ErrorCode } from "~/types/enums/error";
import { TypeformType, type TypeformWebhookPayload } from "~/types/Typeform";
import { db } from "../db";
import EmailService from "../email";
import apiSuService from "../external-api/api-su";
import { clearAllSurveys } from "../test-utils/clear/survey";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { buildWayOfLifeAnswer } from "../test-utils/create-data/wayOfLifeAnswer";
import { buildRequest } from "../test-utils/request/buildRequest";
import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { valideWayOfLifeSurveyPayload } from "../test-utils/wayOfLifeSurvey";
import { handleTypeformAnswer } from "./handleTypeformAnswer";
import { getValidSurveyPhase } from "./helpers";
import { SignatureType, signPayload } from "./signature";

describe("handleAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  const su = 3;
  let survey: Survey;

  let sendEmailMock: jest.SpyInstance;
  let apiSuServiceMock: jest.SpyInstance;

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

    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));

    apiSuServiceMock = jest.spyOn(apiSuService, "assignSu").mockReturnValue(
      Promise.resolve({
        distanceToBarycenter: 1234,
        su: 3,
      }),
    );
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
    });

    it("should return 401 when signature is invalid", async () => {
      const response = await handleTypeformAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(valideSuSurveyPayload, "wrong-signature"),
      );
      expect(response.status).toBe(401);
      expect(await response.text()).toContain("UNAUTHORIZED");

      expect(sendEmailMock).not.toHaveBeenCalled();
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
    });

    it("should throw zod exception when data is not valid", async () => {
      // eslint-disable-next-line
      const payload = JSON.parse(
        JSON.stringify(valideSuSurveyPayload),
      ) as TypeformWebhookPayload;

      // @ts-expect-error allow for test
      payload.form_response.answers[11].email = "wrong-email";
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
      expect(await response.text()).toContain("user should be under 15");

      expect(sendEmailMock).not.toHaveBeenCalled();
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
          params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
          templateId: TemplateId.PHASE_2_NOTIFICATION,
          to: [{ email: "an_account@example.com" }],
        });
      } else {
        expect(sendEmailMock).not.toHaveBeenCalled();
        expect(apiSuServiceMock).not.toHaveBeenCalled();
      }
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
          params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
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
          params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
          templateId: TemplateId.PHASE_2_NOTIFICATION,
          to: [{ email: "an_account@example.com" }],
        });

        const createdData = await db.wayOfLifeAnswer.findMany();

        expect(createdData.length).toBe(1);
        expect(createdData[0]?.suId).toBe(unknownSuData.id);
      });
    }
  });
});

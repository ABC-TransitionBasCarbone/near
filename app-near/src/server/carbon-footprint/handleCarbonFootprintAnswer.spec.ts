import { BroadcastChannel, type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { ZodError } from "zod";
import EmailService from "~/server/email";
import { TemplateId } from "~/types/enums/brevo";
import { handleCarbonFootprintAnswer } from "./handleCarbonFootprintAnswer";
import { buildRequest } from "../test-utils/request/buildRequest";
import { buildCarbonFootprintAnswer } from "../test-utils/create-data/carbonFootprintAnswer";
import { clearAllSurveys } from "../test-utils/clear/survey";

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

  it("should throw 404 when no survey found by name", async () => {
    expect.assertions(3);
    try {
      await handleCarbonFootprintAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(
          {
            email: "test@mail.com",
            neighborhood: "unknown",
            broadcastChannel: BroadcastChannel.mail_campaign,
          },
          "signature",
        ),
      );
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("NOT_FOUND");
        expect(error.message).toBe(ErrorCode.WRONG_SURVEY_NAME);
      }
    } finally {
      expect(sendEmailMock).not.toHaveBeenCalled();
    }
  });

  it("should throw 400 when neighborhood is not defined", async () => {
    expect.assertions(3);
    try {
      await handleCarbonFootprintAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(
          {
            email: "test@mail.com",
            neighborhood: "",
            broadcastChannel: BroadcastChannel.mail_campaign,
          },
          "signature",
        ),
      );
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("BAD_REQUEST");
        expect(error.message).toBe(ErrorCode.WRONG_SURVEY_NAME);
      }
    } finally {
      expect(sendEmailMock).not.toHaveBeenCalled();
    }
  });

  it("should throw zod exception when data is not valid", async () => {
    expect.assertions(2);
    try {
      await handleCarbonFootprintAnswer(
        // @ts-expect-error allow partial for test
        buildRequest(
          {
            email: "test@mail",
            neighborhood: neighborhoodName,
            broadcastChannel: BroadcastChannel.mail_campaign,
          },
          "signature",
        ),
      );
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.errors[0]?.message).toContain("Invalid email");
      }
    } finally {
      expect(sendEmailMock).not.toHaveBeenCalled();
    }
  });

  it(`should return 200 when not in ${SurveyPhase.STEP_4_ADDITIONAL_SURVEY}`, async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_3_SU_EXPLORATION },
      where: { name: neighborhoodName },
    });

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(
        {
          email: "test@mail.com",
          neighborhood: neighborhoodName,
          broadcastChannel: BroadcastChannel.mail_campaign,
        },
        "signature",
      ),
    );

    expect(response.status).toBe(200);
    expect(await response.text()).toContain(
      `step ${SurveyPhase.STEP_4_ADDITIONAL_SURVEY} is over for ${neighborhoodName}`,
    );
    expect(sendEmailMock).not.toHaveBeenCalled();
  });

  it("should return 201 and send email", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(
        {
          email: "test@mail.com",
          neighborhood: neighborhoodName,
          broadcastChannel: BroadcastChannel.mail_campaign,
        },
        "signature",
      ),
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
    expect(sendEmailMock).toHaveBeenCalledWith({
      params: { displayCarbonFootprint: "false", displayWayOfLife: "true" },
      templateId: TemplateId.PHASE_2_NOTIFICATION,
      to: [{ email: "test@mail.com" }],
    });
  });

  it("should return 201 when email is empty and empty email already exist", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    await db.wayOfLifeAnswer.createMany({
      data: [
        buildCarbonFootprintAnswer(survey.id),
        buildCarbonFootprintAnswer(survey.id, { email: null }),
        buildCarbonFootprintAnswer(survey.id, { email: "" }),
        buildCarbonFootprintAnswer(survey.id, { email: undefined }),
      ],
    });

    const response = await handleCarbonFootprintAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(
        {
          neighborhood: neighborhoodName,
          broadcastChannel: BroadcastChannel.mail_campaign,
        },
        "signature",
      ),
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

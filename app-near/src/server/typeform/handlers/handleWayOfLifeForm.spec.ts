import { BroadcastChannel, type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";
import { env } from "~/env";
import { handleWayOfLifeForm } from "./handleWayOfLifeForm";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { buildWayOfLifeAnswer } from "~/server/test-utils/create-data/wayOfLifeAnswer";
import { ZodError } from "zod";
import EmailService from "~/server/email";
import { TemplateId } from "~/types/enums/brevo";
import { clearAllSurveys } from "~/server/test-utils/clear/survey";

describe("handleWayOfLifeForm", () => {
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
      await handleWayOfLifeForm(
        {
          email: "test@mail.com",
        },
        env.WAY_OF_LIFE_FORM_ID,
        "unknown",
        BroadcastChannel.mail_campaign,
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
      await handleWayOfLifeForm(
        {
          email: "test@mail.com",
        },
        env.WAY_OF_LIFE_FORM_ID,
        "",
        BroadcastChannel.mail_campaign,
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
      await handleWayOfLifeForm(
        {
          email: "test@mail",
        },
        env.WAY_OF_LIFE_FORM_ID,
        neighborhoodName,
        BroadcastChannel.mail_campaign,
      );
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.errors[0]?.message).toContain("Invalid email");
      }
    } finally {
      expect(sendEmailMock).not.toHaveBeenCalled();
    }
  });

  it("should return 201 and send email", async () => {
    await db.survey.update({
      data: { phase: SurveyPhase.STEP_4_ADDITIONAL_SURVEY },
      where: { name: neighborhoodName },
    });

    const response = await handleWayOfLifeForm(
      {
        email: "test@mail.com",
      },
      env.WAY_OF_LIFE_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
    expect(sendEmailMock).toHaveBeenCalledWith({
      params: { displayCarbonFootprint: "true", displayWayOfLife: "false" },
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
        buildWayOfLifeAnswer(survey.id),
        buildWayOfLifeAnswer(survey.id, { email: null }),
        buildWayOfLifeAnswer(survey.id, { email: "" }),
        buildWayOfLifeAnswer(survey.id, { email: undefined }),
      ],
    });

    const response = await handleWayOfLifeForm(
      {},
      env.WAY_OF_LIFE_FORM_ID,
      neighborhoodName,
      BroadcastChannel.mail_campaign,
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});

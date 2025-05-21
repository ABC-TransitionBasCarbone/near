import { SurveyPhase } from "@prisma/client";
import { db } from "../db";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { sendUsersSu } from "./sendUsersSu";
import { TRPCError } from "@trpc/server";
import { clearAllSurveys } from "../test-utils/clear/survey";
import EmailService from "../email";
import { env } from "~/env";

describe("sendUsersSu", () => {
  const surveyId = 654;
  const surveyName = "test-send-user-su";

  const fixedDate = new Date("2025-05-16T11:30:36.145Z");
  const fixedUUID = "mocked-uuid-1234";

  let sendEmailMock: jest.SpyInstance;

  beforeEach(async () => {
    sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockReturnValue(Promise.resolve("send"));

    const OriginalDate = Date;
    jest.spyOn(global, "Date").mockImplementation(() => fixedDate);
    Date.now = OriginalDate.now;

    jest.spyOn(global.crypto, "randomUUID").mockReturnValue(fixedUUID);

    await clearAllSurveys();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each(
    Object.values(SurveyPhase).filter(
      (phase) => phase !== SurveyPhase.STEP_3_SU_EXPLORATION,
    ),
  )(`should not send su email to users when phase is %s`, async (phase) => {
    expect.assertions(2);
    await db.survey.create({
      data: {
        id: surveyId,
        name: surveyName,
        phase,
        computedSu: true,
      },
    });

    try {
      await sendUsersSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("FORBIDDEN");
        expect(sendEmailMock).not.toHaveBeenCalled();
      }
    }
  });

  it(`should not send su email to users when su are not computed`, async () => {
    expect.assertions(2);
    await db.survey.create({
      data: {
        id: surveyId,
        name: surveyName,
        phase: SurveyPhase.STEP_3_SU_EXPLORATION,
        computedSu: false,
      },
    });

    try {
      await sendUsersSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("FORBIDDEN");
        expect(sendEmailMock).not.toHaveBeenCalled();
      }
    }
  });

  it("should send su email to users", async () => {
    await db.survey.create({
      data: {
        id: surveyId,
        name: surveyName,
        phase: SurveyPhase.STEP_3_SU_EXPLORATION,
        computedSu: true,
      },
    });
    await db.suData.createMany({
      data: [
        {
          id: 1,
          barycenter: 0.1,
          popPercentage: 0.11,
          su: 11,
          surveyId: surveyId,
        },
        {
          id: 2,
          barycenter: 0.2,
          popPercentage: 0.22,
          su: 22,
          surveyId: surveyId,
        },
      ],
    });

    await db.suAnswer.createMany({
      data: [
        buildSuAnswer(surveyId, { id: 1, email: undefined }),
        buildSuAnswer(surveyId, { id: 2, suId: undefined }),
        buildSuAnswer(surveyId, {
          id: 3,
          email: "email1@mail.com",
          suId: 1,
        }),
        buildSuAnswer(surveyId, {
          id: 4,
          email: "email2@mail.com",
          suId: 2,
        }),
      ],
    });

    const result = await sendUsersSu(surveyId);
    expect(result.every((item) => item.status === "fulfilled")).toBe(true);

    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    expect(sendEmailMock).toHaveBeenCalledWith({
      messageVersions: [
        {
          params: {
            neighborhood: surveyName,
            ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
            numberOfResponses: "4",
            suName: "11",
            wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
          },
          subject:
            "Petite enquête test-send-user-su : merci d'avoir répondu ! Et la suite ?",
          to: [{ email: "email1@mail.com" }],
        },
        {
          params: {
            neighborhood: surveyName,
            ngcUrl: `${env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK}?broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
            numberOfResponses: "4",
            suName: "22",
            wayOfLifeUrl: `${env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK}#broadcast_channel=mail_campaign&broadcast_id=${fixedUUID}&date=${encodeURIComponent(fixedDate.toISOString())}&neighborhood=${surveyName}`,
          },
          subject:
            "Petite enquête test-send-user-su : merci d'avoir répondu ! Et la suite ?",
          to: [{ email: "email2@mail.com" }],
        },
      ],
      templateId: 1,
    });

    const suAnswers = await db.suAnswer.findMany();
    const updatedAnswers = suAnswers
      .filter((answer) => answer.emailApiCalled)
      .map((answer) => answer.email);

    expect(updatedAnswers.length).toBe(2);
    expect(
      updatedAnswers.every((email) =>
        ["email1@mail.com", "email2@mail.com"].includes(email!),
      ),
    ).toBe(true);
  });
});

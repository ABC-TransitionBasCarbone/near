import { SurveyPhase } from "@prisma/client";
import { db } from "../db";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { sendUsersSu } from "./sendUsersSu";
import { TRPCError } from "@trpc/server";

describe("sendUsersSu", () => {
  const surveyId = 654;
  beforeEach(async () => {
    await db.suAnswer.deleteMany().catch(() => null);
    await db.suData
      .deleteMany({ where: { surveyId: surveyId } })
      .catch(() => null);
    await db.survey.delete({ where: { id: surveyId } }).catch(() => null);
  });

  it.each(
    Object.values(SurveyPhase).filter(
      (phase) => phase !== SurveyPhase.STEP_3_SU_EXPLORATION,
    ),
  )(`should not send su email to users when phase is %s`, async (phase) => {
    expect.assertions(1);
    await db.survey.create({
      data: {
        id: surveyId,
        name: "test-send-user-su",
        phase,
        computedSu: true,
      },
    });

    try {
      await sendUsersSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("FORBIDDEN");
      }
    }
  });

  it(`should not send su email to users when su are not computed`, async () => {
    expect.assertions(1);
    await db.survey.create({
      data: {
        id: surveyId,
        name: "test-send-user-su",
        phase: SurveyPhase.STEP_3_SU_EXPLORATION,
        computedSu: false,
      },
    });

    try {
      await sendUsersSu(surveyId);
    } catch (error) {
      if (error instanceof TRPCError) {
        expect(error.code).toBe("FORBIDDEN");
      }
    }
  });

  it("should send su email to users", async () => {
    await db.survey.create({
      data: {
        id: surveyId,
        name: "test-send-user-su",
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

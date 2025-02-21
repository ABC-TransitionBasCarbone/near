import { SurveyPhase } from "@prisma/client";
import { db } from "../db";
import { buildSuAnswer } from "../test-utils/create-data/suAnswer";
import { sendUsersSu } from "./sendUsersSu";
import { TRPCError } from "@trpc/server";

describe("sendUsersSu", () => {
  const surveyId = 654;
  beforeEach(async () => {
    await db.suAnswer.deleteMany({ where: { surveyId } }).catch(() => null);
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
        // computedSu: true,
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

  // it(`should not send su email to users when su are not computed`, async () => {
  //   expect.assertions(1);
  //   await db.survey.create({
  //     data: {
  //       id: surveyId,
  //       name: "test-send-user-su",
  //       phase: SurveyPhase.STEP_3_SU_EXPLORATION,
  //       computedSu: false,
  //     },
  //   });

  //   try {
  //     await sendUsersSu(surveyId);
  //   } catch (error) {
  //     if (error instanceof TRPCError) {
  //       expect(error.code).toBe("FORBIDDEN");
  //     }
  //   }
  // });

  it("should send su email to users", async () => {
    await db.survey.create({
      data: {
        id: surveyId,
        name: "test-send-user-su",
        phase: SurveyPhase.STEP_3_SU_EXPLORATION,
        // computedSu: true,
      },
    });

    await db.suAnswer.createMany({
      data: [
        buildSuAnswer(surveyId, { id: 1, email: undefined }),
        buildSuAnswer(surveyId, { id: 2, userSu: undefined }),
        buildSuAnswer(surveyId, {
          id: 3,
          email: "email1@mail.com",
          userSu: "SU1",
        }),
        buildSuAnswer(surveyId, {
          id: 4,
          email: "email2@mail.com",
          userSu: "SU1",
        }),
      ],
    });

    const result = await sendUsersSu(surveyId);

    expect(result).toMatchSnapshot();
  });
});

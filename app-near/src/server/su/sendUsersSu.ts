import { TemplateId } from "~/types/enums/brevo";
import { db } from "../db";
import EmailService from "../email";
import { SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

export const sendUsersSu = async (
  surveyId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<Promise<PromiseSettledResult<string | Response>[]>> => {
  const survey = await db.survey.findFirst({ where: { id: surveyId } });

  if (!survey || survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.MISSING_SURVEY_PHASE,
    });
  }

  if (!survey.computedSu) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.SU_NOT_COMPUTED,
    });
  }

  const answers = await db.suAnswer.findMany({
    where: { surveyId, email: { not: null }, su: { su: { not: undefined } } },
    select: { id: true, email: true, su: true },
  }); // warning potential memory issue ?

  const results = await Promise.allSettled(
    answers.map((answer) => {
      return EmailService.sendEmail({
        templateId: TemplateId.SU_RESULT,
        to: [{ email: answer.email! }],
        params: { suName: `${answer.su!.su}` },
      });
    }),
  );

  const errors = results.filter((result) => result.status === "rejected");

  if (errors.length) {
    errors.forEach((error) => console.error(error));
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: ErrorCode.SU_SEND_EMAIL,
    });
  }

  return results;
};

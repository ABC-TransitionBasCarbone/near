import { TemplateId } from "~/types/enums/brevo";
import { db } from "../db";
import EmailService from "../email";
import { type AxiosResponse } from "axios";
import { SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const sendUsersSu = async (
  surveyId: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<PromiseSettledResult<AxiosResponse<any, any> | undefined>[]> => {
  const survey = await db.survey.findFirst({ where: { id: surveyId } });

  if (!survey || survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "survey phase is not correct",
    });
  }

  // waiting NEAR-57
  // if (!survey.computedSurvey) {
  //   throw new TRPCError({
  //     code: "FORBIDDEN",
  //     message: "surveys are not computed",
  //   });
  // }

  const answers = await db.suAnswer.findMany({
    where: { surveyId },
    select: { id: true, email: true, userSu: true },
  }); // warning potential memory issue ?

  const results = await Promise.allSettled(
    answers.map((answer) => {
      if (!answer.email)
        return Promise.reject(
          new Error(`Missing email for answer_su with id: ${answer.id}`),
        );
      if (!answer.userSu)
        return Promise.reject(
          new Error(`Missing SU for answer_su with id: ${answer.id}`),
        );

      return EmailService.sendEmail({
        templateId: TemplateId.SU_RESULT,
        to: [{ email: answer.email }],
        params: { suName: answer.userSu },
      });
    }),
  );

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(result.reason);
    }
  });

  return results;
};

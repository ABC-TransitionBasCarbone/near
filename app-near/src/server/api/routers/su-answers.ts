import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { countAnswers } from "../../su/answers/count";
import representativenessService from "../../su/answers/representativeness";
import { sendUsersSu } from "~/server/su/sendUsersSu";

export const suAnswersRouter = createTRPCRouter({
  count: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return countAnswers(surveyId);
  }),

  representativeness: protectedProcedure.query(async ({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return representativenessService.representativeness(surveyId);
  }),
  sendSu: protectedProcedure.mutation(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return sendUsersSu(surveyId);
  }),
});

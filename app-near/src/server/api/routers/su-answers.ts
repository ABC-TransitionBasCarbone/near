import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { countAnswers } from "../../su/answers/count";
import { z } from "zod";
import representativenessService from "../../su/answers/representativeness";
import { sendUsersSu } from "~/server/su/sendUsersSu";

export const suAnswersRouter = createTRPCRouter({
  count: protectedProcedure
    .input(z.number())
    .query(({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.survey?.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return countAnswers(surveyId);
    }),

  representativeness: protectedProcedure
    .input(z.number())
    .query(async ({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.survey?.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return representativenessService.representativeness(surveyId);
    }),
  sendSu: protectedProcedure
    .input(z.number())
    .mutation(({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.survey?.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return sendUsersSu(surveyId);
    }),
});

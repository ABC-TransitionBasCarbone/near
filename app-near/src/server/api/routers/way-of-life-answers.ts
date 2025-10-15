import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { countWayOfLifeAnswers } from "~/server/way-of-life/count";

export const wayOfLifeAnswersRouter = createTRPCRouter({
  count: protectedProcedure
    .input(z.number())
    .query(({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.survey?.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return countWayOfLifeAnswers(surveyId);
    }),
});

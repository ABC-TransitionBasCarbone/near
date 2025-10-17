import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { countWayOfLifeAnswers } from "~/server/way-of-life/count";

export const wayOfLifeAnswersRouter = createTRPCRouter({
  count: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return countWayOfLifeAnswers(surveyId);
  }),
});

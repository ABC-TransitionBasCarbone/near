import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { countCarbonFootprintAnswers } from "~/server/carbon-footprint/count";

export const carbonFootprintAnswersRouter = createTRPCRouter({
  count: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return countCarbonFootprintAnswers(surveyId);
  }),
});

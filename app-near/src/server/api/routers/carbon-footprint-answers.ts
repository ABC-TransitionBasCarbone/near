import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { countCarbonFootprintAnswers } from "~/server/carbon-footprint/count";

export const carbonFootprintAnswersRouter = createTRPCRouter({
  count: protectedProcedure
    .input(z.number())
    .query(({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.survey?.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return countCarbonFootprintAnswers(surveyId);
    }),
});

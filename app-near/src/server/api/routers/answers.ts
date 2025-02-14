import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { countAnswsers } from "../../su/answers/count";
import { z } from "zod";

export const answersRouter = createTRPCRouter({
  count: protectedProcedure
    .input(z.number())
    .query(({ ctx, input: surveyId }) => {
      if (surveyId !== ctx.session.user.surveyId) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      return countAnswsers(surveyId);
    }),
});

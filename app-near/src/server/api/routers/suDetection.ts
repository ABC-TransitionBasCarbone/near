import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { computeSu } from "~/server/su/computeSu";

export const suDetectionRouter = createTRPCRouter({
  run: protectedProcedure.mutation(async ({ ctx }) => {
    const { surveyId } = ctx.session.user;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    return computeSu(surveyId);
  }),
});

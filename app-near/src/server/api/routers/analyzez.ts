import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllQualityStatistics } from "~/server/analyzes/quality";

export const analyzesRouter = createTRPCRouter({
  quality: protectedProcedure.query(({ ctx }) => {
    return getAllQualityStatistics(ctx.session.user.surveyId);
  }),
});

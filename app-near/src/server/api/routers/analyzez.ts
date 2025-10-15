import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllQualityStatistics } from "~/server/analyzes/quality";

export const analyzesRouter = createTRPCRouter({
  quality: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.survey?.id) return null;
    return getAllQualityStatistics(ctx.session.user.survey?.id);
  }),
});

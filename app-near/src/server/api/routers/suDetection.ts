import { createTRPCRouter, surveyProtectedProcedure } from "../trpc";
import { computeSu, getSuList } from "~/server/su/computeSu";

export const suDetectionRouter = createTRPCRouter({
  run: surveyProtectedProcedure.mutation(async ({ ctx }) => {
    return computeSu(ctx.session.user.survey.id);
  }),
  getList: surveyProtectedProcedure.query(async ({ ctx }) => {
    return getSuList(ctx.session.user.survey.id);
  }),
});

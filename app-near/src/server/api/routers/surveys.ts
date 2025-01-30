import { getOneSurvey } from "~/server/surveys/get";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const surveysRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    return getOneSurvey(ctx.session.user.surveyId);
  }),
});

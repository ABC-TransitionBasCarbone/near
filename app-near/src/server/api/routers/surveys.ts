import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getAllSurveys, getOneSurvey } from "~/server/surveys/get";
import { updateSurvey } from "~/server/surveys/put";
import { RoleName, SurveyPhase } from "@prisma/client";
import { userIsGranted } from "~/shared/services/roles/grant-rules";

export const surveysRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) return null;
    return getOneSurvey(surveyId);
  }),

  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filter: z.string().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      if (!userIsGranted(ctx.session.user, [RoleName.ADMIN])) {
        return null;
      }
      return getAllSurveys(input.page, input.limit, input.filter);
    }),

  update: protectedProcedure
    .input(
      z.object({
        surveyId: z.number(),
        data: z
          .object({
            phase: z.nativeEnum(SurveyPhase).optional(),
            sampleTarget: z.number().optional(),
          })
          .strict(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const surveyId = ctx.session.user.survey?.id;
      if (!surveyId) return null;
      return updateSurvey(surveyId, input.data);
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneSurvey } from "~/server/surveys/get";
import { updateSurvey } from "~/server/surveys/put";
import { SurveyPhase } from "@prisma/client";

export const surveysRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    if (!ctx.session.user.survey?.id) return null;
    return getOneSurvey(ctx.session.user.survey?.id);
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
      if (!ctx.session.user.survey?.id) return null;
      return updateSurvey(ctx.session.user.survey?.id, input.data);
    }),
});

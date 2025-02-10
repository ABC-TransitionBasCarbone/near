import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneSurvey } from "~/server/surveys/get";
import { updateSurvey } from "~/server/surveys/put";
import { SurveyPhase } from "@prisma/client";

export const surveysRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    return getOneSurvey(ctx.session.user.surveyId);
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
      return updateSurvey(ctx.session.user.surveyId, input.data);
    }),
});

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { buildSurveyLink } from "~/server/surveyLinks/build";
import { SurveyType } from "~/types/enums/survey";
import { BroadcastType } from "~/types/enums/broadcasting";

export const surveyLinksRouter = createTRPCRouter({
  build: protectedProcedure
    .input(
      z.object({
        broadcastType: z.nativeEnum(BroadcastType),
        surveyType: z.nativeEnum(SurveyType),
      }),
    )
    .mutation(({ ctx, input }) => {
      const survey = ctx.session.user.survey;
      if (!survey?.id) throw new TRPCError({ code: "FORBIDDEN" });

      return buildSurveyLink(
        survey.id,
        input.broadcastType,
        input.surveyType,
        survey.name,
      );
    }),
});

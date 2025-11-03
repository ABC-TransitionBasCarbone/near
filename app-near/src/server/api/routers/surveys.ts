import { RoleName, SurveyPhase } from "@prisma/client";
import { z } from "zod";
import { createSurvey } from "~/server/surveys/create";
import { deleteSurvey } from "~/server/surveys/delete";
import { getOneSurvey, querySurveys } from "~/server/surveys/get";
import { updateSurvey } from "~/server/surveys/put";
import { surveyForm } from "~/shared/validations/surveyEdit.validation";
import {
  createTRPCRouter,
  hasRoleMiddleware,
  protectedProcedure,
} from "../trpc";

export const surveysRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) return null;
    return getOneSurvey(surveyId);
  }),

  querySurveys: protectedProcedure
    .use(hasRoleMiddleware([RoleName.ADMIN]))
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filter: z.string().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      return querySurveys(input.page, input.limit, input.filter);
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

  create: protectedProcedure
    .use(hasRoleMiddleware([RoleName.ADMIN]))
    .input(surveyForm)
    .mutation(async ({ ctx, input }) => {
      return createSurvey(
        input.name,
        input.iris.map((iris) => iris.value),
      );
    }),

  delete: protectedProcedure
    .use(hasRoleMiddleware([RoleName.ADMIN]))
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return deleteSurvey(input);
    }),
});

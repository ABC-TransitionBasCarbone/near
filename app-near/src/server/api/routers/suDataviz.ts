import { z } from "zod";
import { getBarrierQuestion } from "~/server/su/dataviz/barriers";
import {
  getCarbonSankey,
  getCarbonSankeyGlobalMax,
} from "~/server/su/dataviz/carbonSankey";
import { getSuInfo } from "~/server/su/dataviz/get";
import { getMobility } from "~/server/su/dataviz/mobility";
import { getSatisfactionDistribution } from "~/server/su/dataviz/satisfactionDistribution";
import { getSuAnswerDistribution } from "~/server/su/dataviz/suAnswerDistribution";
import { getTestimonyNetwork } from "~/server/su/dataviz/testimonyNetwork";
import { getUsageDistribution } from "~/server/su/dataviz/usageDistribution";
import { getWillingness } from "~/server/su/dataviz/willingness";
import { BARRIER_FIELDS } from "~/shared/services/dataviz/barriers";
import { USAGE_FIELDS } from "~/shared/services/dataviz/usage";
import { SATISFACTION_SUBCATEGORY_KEYS } from "~/shared/services/dataviz/satisfaction";
import { SU_ANSWER_CATEGORY_FIELDS } from "~/shared/services/dataviz/suAnswerCategory";
import { createTRPCRouter, surveyProtectedProcedure } from "../trpc";

const toZodEnum = <T extends string>(values: T[]) =>
  z.enum(values as [T, ...T[]]);

export const suDatavizRouter = createTRPCRouter({
  getSuInfo: surveyProtectedProcedure.query(async ({ ctx }) => {
    return getSuInfo(ctx.session.user.survey.id);
  }),
  getSuAnswerDistribution: surveyProtectedProcedure
    .input(
      z.object({
        field: toZodEnum(SU_ANSWER_CATEGORY_FIELDS),
        selectedSus: z.array(z.number()).optional(),
      }),
    )
    .query(({ ctx, input }) =>
      getSuAnswerDistribution(
        ctx.session.user.survey.id,
        input.field,
        input.selectedSus,
      ),
    ),
  getUsageDistribution: surveyProtectedProcedure
    .input(
      z.object({
        field: toZodEnum(USAGE_FIELDS),
        selectedSus: z.array(z.number()).optional(),
      }),
    )
    .query(({ ctx, input }) =>
      getUsageDistribution(
        ctx.session.user.survey.id,
        input.field,
        input.selectedSus,
      ),
    ),
  getSatisfactionDistribution: surveyProtectedProcedure
    .input(
      z.object({
        subcategory: toZodEnum(SATISFACTION_SUBCATEGORY_KEYS).optional(),
        selectedSus: z.array(z.number()).optional(),
      }),
    )
    .query(({ ctx, input }) =>
      getSatisfactionDistribution(
        ctx.session.user.survey.id,
        input.selectedSus,
        input.subcategory,
      ),
    ),
  getCarbonSankey: surveyProtectedProcedure
    .input(z.object({ selectedSus: z.array(z.number()).optional() }))
    .query(({ ctx, input }) =>
      getCarbonSankey(ctx.session.user.survey.id, input.selectedSus),
    ),
  getCarbonSankeyGlobalMax: surveyProtectedProcedure.query(({ ctx }) =>
    getCarbonSankeyGlobalMax(ctx.session.user.survey.id),
  ),
  getMobility: surveyProtectedProcedure
    .input(z.object({ selectedSus: z.array(z.number()).optional() }))
    .query(({ ctx, input }) =>
      getMobility(ctx.session.user.survey.id, input.selectedSus),
    ),
  getWillingness: surveyProtectedProcedure
    .input(z.object({ selectedSus: z.array(z.number()).optional() }))
    .query(({ ctx, input }) =>
      getWillingness(ctx.session.user.survey.id, input.selectedSus),
    ),
  getTestimonyNetwork: surveyProtectedProcedure
    .input(z.object({ selectedSus: z.array(z.number()).optional() }))
    .query(({ ctx, input }) =>
      getTestimonyNetwork(ctx.session.user.survey.id, input.selectedSus),
    ),
  getBarrierQuestion: surveyProtectedProcedure
    .input(
      z.object({
        questionKey: toZodEnum([...BARRIER_FIELDS, "all"] as const),
        selectedSus: z.array(z.number()).optional(),
      }),
    )
    .query(({ ctx, input }) =>
      getBarrierQuestion(
        ctx.session.user.survey.id,
        input.selectedSus,
        input.questionKey,
      ),
    ),
});

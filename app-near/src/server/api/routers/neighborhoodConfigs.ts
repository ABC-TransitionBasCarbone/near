import { createTRPCRouter, surveyProtectedProcedure } from "../trpc";
import { neighborhoodConfigSchema } from "~/schemas/neighborhood-config";
import {
  getOneNeighborhoodConfig,
  neighborhoodConfigIsCompleted,
} from "~/server/neighborhoodConfig/get";
import { upsertNeighborhoodConfig } from "~/server/neighborhoodConfig/upsert";

export const neighborhoodsConfigsRouter = createTRPCRouter({
  getOne: surveyProtectedProcedure.query(({ ctx }) => {
    return getOneNeighborhoodConfig(ctx.session.user.survey.id);
  }),
  isCompleted: surveyProtectedProcedure.query(({ ctx }) => {
    return neighborhoodConfigIsCompleted(ctx.session.user.survey.id);
  }),
  upsertOne: surveyProtectedProcedure
    .input(neighborhoodConfigSchema)
    .mutation(({ ctx, input }) => {
      return upsertNeighborhoodConfig(ctx.session.user.survey.id, input);
    }),
});

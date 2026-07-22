import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { neighborhoodConfigSchema } from "~/schemas/neighborhood-config";
import { getOneNeighborhoodConfig } from "~/server/neighborhoodConfig/get";
import { upsertNeighborhoodConfig } from "~/server/neighborhoodConfig/upsert";

export const neighborhoodsConfigsRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) throw new TRPCError({ code: "FORBIDDEN" });

    return getOneNeighborhoodConfig(surveyId);
  }),
  upsertOne: protectedProcedure
    .input(neighborhoodConfigSchema)
    .mutation(({ ctx, input }) => {
      const surveyId = ctx.session.user.survey?.id;
      if (!surveyId) throw new TRPCError({ code: "FORBIDDEN" });

      return upsertNeighborhoodConfig(surveyId, input);
    }),
});

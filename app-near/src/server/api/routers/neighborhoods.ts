import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneNeighborhood } from "~/server/neighborhoods/get";
import { TRPCError } from "@trpc/server";

export const neighborhoodsRouter = createTRPCRouter({
  getOne: protectedProcedure.query(({ ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getOneNeighborhood(surveyId);
  }),
});

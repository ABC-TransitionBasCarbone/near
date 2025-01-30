import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneNeighborhood } from "~/server/neighborhoods/get";
import { TRPCError } from "@trpc/server";

export const neighborhoodsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.number()).query(({ ctx, input: id }) => {
    if (id !== ctx.session.user.surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getOneNeighborhood(id);
  }),
});

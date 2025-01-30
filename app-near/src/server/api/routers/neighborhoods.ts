import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneNeighborood } from "~/server/neighboroods/get";
import { TRPCError } from "@trpc/server";

export const neighboroodsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.number()).query(({ ctx, input: id }) => {
    if (id !== ctx.session.user.surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    return getOneNeighborood(id);
  }),
});

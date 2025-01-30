import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getOneNeighborood } from "~/server/neighboroods/get";

export const neighboroodsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.number()).query(({ input: id }) => {
    return getOneNeighborood(id);
  }),
});

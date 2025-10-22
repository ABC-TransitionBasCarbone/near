import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { userIsGranted } from "~/shared/services/roles/grant-rules";
import { RoleName } from "@prisma/client";
import { queryInseeIris } from "~/server/insee/get";

export const irisRouter = createTRPCRouter({
  queryInseeIris: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      if (!userIsGranted(ctx.session.user, [RoleName.ADMIN])) return null;
      return queryInseeIris(input);
    }),
});

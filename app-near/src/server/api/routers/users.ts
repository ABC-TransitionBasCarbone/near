import { RoleName } from "@prisma/client";
import { z } from "zod";
import { createPiloteUser } from "~/server/users/create";
import { queryUsers } from "~/server/users/get";
import { userIsGranted } from "~/shared/services/roles/grant-rules";
import { userform } from "~/shared/validations/userEdit.validation";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  createPilote: protectedProcedure
    .input(userform)
    .mutation(async ({ ctx, input }) => {
      if (!userIsGranted(ctx.session.user, [RoleName.ADMIN])) return null;
      return createPiloteUser(input.email, input.surveyId);
    }),

  queryPiloteUsers: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filter: z.string().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      if (!userIsGranted(ctx.session.user, [RoleName.ADMIN])) {
        return null;
      }
      return queryUsers(input.page, input.limit, input.filter);
    }),
});

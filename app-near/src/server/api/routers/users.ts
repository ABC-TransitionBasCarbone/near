import { RoleName } from "@prisma/client";
import { z } from "zod";
import { getOneUser, queryUsers } from "~/server/users/get";
import { userIsGranted } from "~/shared/services/roles/grant-rules";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { userform } from "~/shared/validations/userEdit.validation";
import { createUser } from "~/server/users/create";

export const usersRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.number()).query(({ input, ctx }) => {
    const surveyId = ctx.session.user.survey?.id;
    if (!surveyId) return null;
    return getOneUser(input);
  }),

  create: protectedProcedure
    .input(userform)
    .mutation(async ({ ctx, input }) => {
      if (!userIsGranted(ctx.session.user, [RoleName.ADMIN])) return null;
      return createUser(input.email, input.surveyId);
    }),

  queryUsers: protectedProcedure
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

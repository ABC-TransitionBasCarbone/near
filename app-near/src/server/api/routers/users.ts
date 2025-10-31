import { RoleName } from "@prisma/client";
import { z } from "zod";
import { createPiloteUser } from "~/server/users/create";
import { queryUsers } from "~/server/users/get";
import { userform } from "~/shared/validations/userEdit.validation";
import { createTRPCRouter, hasRole, protectedProcedure } from "../trpc";

export const usersRouter = createTRPCRouter({
  createPilote: protectedProcedure
    .use(hasRole(RoleName.ADMIN))
    .input(userform)
    .mutation(async ({ ctx, input }) => {
      return createPiloteUser(input.email, input.surveyId);
    }),

  queryPiloteUsers: protectedProcedure
    .use(hasRole(RoleName.ADMIN))
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        filter: z.string().optional(),
      }),
    )
    .query(({ input, ctx }) => {
      return queryUsers(input.page, input.limit, input.filter);
    }),
});

import { type RoleName } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import { hasSomeRolesAndLevelsGrantedForUser } from "~/shared/services/roles/grant-rules";

export const hasRoleOrThrow = (
  ctx: { session: Session | null },
  roles: RoleName[],
) => {
  const user = ctx.session?.user;

  if (!user || !hasSomeRolesAndLevelsGrantedForUser(user.roles, roles)) {
    throw new TRPCError({
      code: "FORBIDDEN",
    });
  }
};

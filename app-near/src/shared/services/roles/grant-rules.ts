import { type RoleName } from "@prisma/client";
import { type NextAuthUser } from "~/types/NextAuth";

const hasSomeRolesAndLevelsGrantedForUser = (
  roleNames: RoleName[] = [],
  grantedRoles: RoleName[] = [],
): boolean => {
  return roleNames.some((roleName) =>
    grantedRoles.some((granted) => roleName === granted),
  );
};

export const userIsGranted = (
  user?: NextAuthUser,
  rules: RoleName[] = [],
): boolean => {
  if (!user) return false;

  if (!user.roles) return false;

  return hasSomeRolesAndLevelsGrantedForUser(user.roles, rules);
};

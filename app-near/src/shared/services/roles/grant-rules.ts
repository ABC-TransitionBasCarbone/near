import { type RoleName } from "@prisma/client";
import { type NextAuthUser } from "~/types/NextAuth";

export const hasSomeRolesAndLevelsGrantedForUser = (
  userRoles: RoleName[] = [],
  neededRoles: RoleName[] = [],
): boolean => {
  return userRoles.some((roleName) =>
    neededRoles.some((granted) => roleName === granted),
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

import { RoleName } from "@prisma/client";
import { userIsGranted } from "~/shared/services/roles/grant-rules";
import { NavAction, NavItem } from "~/types/enums/navBar";
import { type NavBar } from "~/types/NavBar";
import { type NextAuthUser } from "~/types/NextAuth";

export const navBackOfficeItems = (): Record<NavItem, NavBar> => ({
  [NavItem.DASHBOARD]: {
    title: "Dashboard",
    url: "/back-office",
    icon: NavItem.DASHBOARD,
    onlyFor: [RoleName.ADMIN],
  },
  [NavItem.SURVEY]: {
    title: "Quartiers",
    url: "/back-office/quartiers",
    icon: NavItem.SURVEY,
    onlyFor: [RoleName.ADMIN],
  },
  [NavItem.USER]: {
    title: "Utilisateurs",
    url: "/back-office/utilisateurs",
    icon: NavItem.USER,
    onlyFor: [RoleName.ADMIN],
  },
  [NavItem.LOGOUT]: {
    title: "Se déconnecter",
    icon: NavItem.LOGOUT,
    onlyFor: [RoleName.ADMIN],
    action: NavAction.LOGOUT,
  },
});

const filterOptions = (user?: NextAuthUser, onlyFor?: RoleName[]): boolean => {
  if (!onlyFor) return true;
  return userIsGranted(user, onlyFor);
};

export const getNavBar = (
  navBar: () => Record<NavItem, NavBar>,
  user?: NextAuthUser,
): NavBar[] => {
  return Object.values(navBar()).filter((item) =>
    filterOptions(user, item.onlyFor),
  );
};

import { type RoleName } from "@prisma/client";
import { type NavItem, type NavAction } from "./enums/navBar";

export interface NavBar {
  title: string;
  url?: string;
  action?: NavAction;
  icon?: NavItem;
  style?: string;
  onlyFor?: RoleName[];
}

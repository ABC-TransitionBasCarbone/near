"use client";

import { signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { NavAction, NavItem } from "~/types/enums/navBar";
import { type NavBar } from "~/types/NavBar";
import PollOutlinedIcon from "@mui/icons-material/PollOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Link from "next/link";

const getCustomStyle = (
  displayUrl: string,
  itemUrl?: string,
  desktopItemsColors?: string,
) => {
  if (displayUrl === itemUrl) {
    return "text-white bg-blue font-bold focus:ring-0";
  }
  return `text-blue ${desktopItemsColors ?? ""} font-normal`;
};

const navBarActions: Record<NavAction, () => Promise<void>> = {
  [NavAction.LOGOUT]: signOut,
  [NavAction.LOGIN]: signIn,
};

interface NavBarItemProps {
  item: NavBar;
  desktopItemsColors?: string;
}

const NavBarItem: React.FC<NavBarItemProps> = ({
  item,
  desktopItemsColors,
}) => {
  const pathname = usePathname();

  const globalStyle = `flex px-3 py-1 rounded no-underline w-full ${item.style ?? ""}`;

  const customStyle = getCustomStyle(pathname, item.url, desktopItemsColors);

  const mapIcon: Record<NavItem, ReactNode> = {
    [NavItem.DASHBOARD]: <AppsOutlinedIcon aria-hidden />,
    [NavItem.SURVEY]: <PollOutlinedIcon aria-hidden />,
    [NavItem.USER]: <GroupOutlinedIcon aria-hidden />,
    [NavItem.LOGOUT]: <LogoutOutlinedIcon aria-hidden />,
  };

  const handleNavItemClick = () => {
    const menuToggle = document.getElementById(
      "menu-toggle",
    ) as HTMLInputElement;
    if (menuToggle) {
      menuToggle.checked = false;
    }
  };

  const displayItem = useCallback(
    (title: string, icon?: NavItem) => (
      <div className="flex items-center gap-2">
        {icon && mapIcon[icon]}
        <div className="truncate">{title}</div>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  if (item.url) {
    return (
      <Link
        href={item.url}
        className={`${globalStyle} ${customStyle}`}
        onClick={handleNavItemClick}
      >
        {displayItem(item.title, item.icon)}
      </Link>
    );
  }

  if (item.action) {
    return (
      <button
        type="button"
        className={`${globalStyle} ${customStyle}`}
        onClick={async () => {
          handleNavItemClick();
          await navBarActions[item.action!]();
        }}
      >
        {displayItem(item.title, item.icon)}
      </button>
    );
  }

  return null;
};

export default NavBarItem;

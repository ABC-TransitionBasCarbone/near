import NavBarItem from "./NavBarItem";
import { getNavBar, navBackOfficeItems } from "../../_services/nav/get";
import { auth } from "~/server/auth";

const NavBarBackOffice: React.FC = async () => {
  const session = await auth();
  const navItems = getNavBar(navBackOfficeItems, session?.user);

  return (
    <nav className="flex-grow">
      <ul className="flex flex-col gap-3">
        {navItems.map((navItem) => (
          <li key={navItem.title}>
            <NavBarItem item={navItem} />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBarBackOffice;

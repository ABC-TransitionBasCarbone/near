import { RoleName } from "@prisma/client";
import GrantAccess from "./GrantAccess";
import Link from "next/link";
import NavBarBackOffice from "../back-office/nav/NavBarBackOffice";
import FooterBackOffice from "../back-office/footer/FooterBackOffice";

interface LayoutBackOffice {
  children: JSX.Element;
}

const LayoutBackOffice: React.FC<LayoutBackOffice> = async ({ children }) => {
  return (
    <GrantAccess allowedRoles={[RoleName.ADMIN]}>
      <div className="flex min-h-screen flex-col md:flex-row">
        <header className="flex items-center justify-between p-4 shadow md:hidden">
          <img src="/logos/logo_near.svg" alt="" />
          <label
            htmlFor="menu-toggle"
            className="cursor-pointer p-2 focus:outline-none focus:ring md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </header>
        <input
          type="checkbox"
          id="menu-toggle"
          className="peer hidden"
          style={{ display: "none" }}
        />
        <div className="md:bg-transparent absolute left-0 top-24 z-10 hidden h-[calc(100vh-6rem)] w-full flex-col gap-10 bg-white px-4 pb-8 pt-6 text-blue shadow transition-all duration-500 ease-in-out peer-checked:flex md:static md:z-auto md:flex md:h-screen md:w-[250px]">
          <header className="hidden md:flex">
            <Link href="/" className="flex rounded p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/logo_near.svg"
                height={143}
                width={143}
                alt="retour au site web"
              />
            </Link>
          </header>
          <NavBarBackOffice />
          <FooterBackOffice />
        </div>
        <main className="max-w-full flex-grow px-4 py-6 md:px-16 md:py-12">
          {children}
        </main>
      </div>
    </GrantAccess>
  );
};

export default LayoutBackOffice;

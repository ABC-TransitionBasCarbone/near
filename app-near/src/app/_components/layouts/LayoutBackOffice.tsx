import { RoleName } from "@prisma/client";
import GrantAccess from "./GrantAccess";

interface LayoutBackOffice {
  children: JSX.Element;
}

const LayoutBackOffice: React.FC<LayoutBackOffice> = async ({ children }) => {
  return <GrantAccess allowedRoles={[RoleName.ADMIN]}>{children}</GrantAccess>;
};

export default LayoutBackOffice;

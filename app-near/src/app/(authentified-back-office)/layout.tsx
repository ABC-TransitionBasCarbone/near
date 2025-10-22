import { type ReactNode } from "react";
import LayoutBackOffice from "../_components/layouts/LayoutBackOffice";
import VerifySession from "../_components/layouts/VerifySession";

interface LayoutProps {
  children: ReactNode;
}
const LayoutBackOfficeContainer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutBackOffice>
      <VerifySession>{children}</VerifySession>
    </LayoutBackOffice>
  );
};

export default LayoutBackOfficeContainer;

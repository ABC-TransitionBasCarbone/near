import { type ReactNode } from "react";
import LayoutAuthentified from "../_components/layouts/LayoutAuthentified";

interface LayoutProps {
  children: ReactNode;
}
const BackOfficeLayoutWithNav: React.FC<LayoutProps> = ({ children }) => (
  <LayoutAuthentified>{children}</LayoutAuthentified>
);

export default BackOfficeLayoutWithNav;

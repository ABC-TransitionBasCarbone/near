import { type ReactNode } from "react";
import LayoutPublic from "../_components/layouts/LayoutPublic";

interface LayoutProps {
  children: ReactNode;
}
const LayoutPublicContainer: React.FC<LayoutProps> = ({ children }) => {
  return <LayoutPublic>{children}</LayoutPublic>;
};

export default LayoutPublicContainer;

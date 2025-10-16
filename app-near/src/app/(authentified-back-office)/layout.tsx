import LayoutBackOffice from "../_components/layouts/LayoutBackOffice";

interface LayoutProps {
  children: JSX.Element;
}
const LayoutBackOfficeContainer: React.FC<LayoutProps> = ({ children }) => {
  return <LayoutBackOffice>{children}</LayoutBackOffice>;
};

export default LayoutBackOfficeContainer;

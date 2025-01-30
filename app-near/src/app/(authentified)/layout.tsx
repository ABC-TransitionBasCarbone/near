import { type ReactNode } from "react";
import LayoutAuthentified from "../_components/layouts/LayoutAuthentified";
import { SurveyStateProvider } from "../_components/_context/surveyStateContext";

interface LayoutProps {
  children: ReactNode;
}
const BackOfficeLayoutWithNav: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SurveyStateProvider>
      <LayoutAuthentified>{children}</LayoutAuthentified>
    </SurveyStateProvider>
  );
};

export default BackOfficeLayoutWithNav;

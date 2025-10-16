import { type ReactNode } from "react";
import LayoutSurvey from "../_components/layouts/LayoutSurvey";
import { SurveyStateProvider } from "../_components/_context/surveyStateContext";

interface LayoutProps {
  children: ReactNode;
}
const LayoutSurveyContainer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SurveyStateProvider>
      <LayoutSurvey>{children}</LayoutSurvey>
    </SurveyStateProvider>
  );
};

export default LayoutSurveyContainer;

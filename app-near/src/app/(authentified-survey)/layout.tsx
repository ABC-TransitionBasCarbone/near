import { type ReactNode } from "react";
import LayoutSurvey from "../_components/layouts/LayoutSurvey";
import { SurveyStateProvider } from "../_components/_context/surveyStateContext";
import VerifySession from "../_components/layouts/VerifySession";

interface LayoutProps {
  children: ReactNode;
}
const LayoutSurveyContainer: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SurveyStateProvider>
      <LayoutSurvey>
        <VerifySession>{children}</VerifySession>
      </LayoutSurvey>
    </SurveyStateProvider>
  );
};

export default LayoutSurveyContainer;

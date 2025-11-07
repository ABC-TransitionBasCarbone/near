import { type ReactNode } from "react";
import SurveyHeader from "../survey/SurveyHeader";
import SurveyFooter from "../survey/SurveyFooter";
import { RoleName } from "@prisma/client";
import GrantAccess from "./GrantAccess";

interface LayoutAuthentifiedProps {
  children: ReactNode;
}

const LayoutSurvey: React.FC<LayoutAuthentifiedProps> = async ({
  children,
}) => {
  return (
    <GrantAccess allowedRoles={[RoleName.PILOTE]}>
      <div className="flex min-h-screen flex-col">
        <header>
          <SurveyHeader />
        </header>
        <main role="main" className="flex flex-1 flex-col">
          {children}
        </main>
        <footer>
          <SurveyFooter />
        </footer>
      </div>
    </GrantAccess>
  );
};

export default LayoutSurvey;

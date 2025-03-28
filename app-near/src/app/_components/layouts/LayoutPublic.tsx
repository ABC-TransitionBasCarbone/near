import { type ReactNode } from "react";
import SurveyFooter from "../survey/SurveyFooter";

interface LayoutPublicProps {
  children: ReactNode;
}

const LayoutPublic: React.FC<LayoutPublicProps> = async ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <div className="mx-2 my-8 flex flex-wrap items-center justify-center gap-4 sm:mx-12">
          <div className="flex w-full items-center justify-between gap-2 sm:w-fit sm:gap-4">
            <img src="/logos/logo_near.svg" alt="" />
          </div>
        </div>
      </header>
      <main role="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <footer>
        <SurveyFooter />
      </footer>
    </div>
  );
};

export default LayoutPublic;

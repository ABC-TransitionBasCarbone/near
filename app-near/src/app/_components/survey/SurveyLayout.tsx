import { type ReactNode } from "react";
import SimpleBanner from "../_ui/SimpleBanner";

interface SurveyLayoutProps {
  children: ReactNode;
  banner: ReactNode;
  actions: ReactNode;
}
const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  children,
  banner,
  actions,
}) => {
  return (
    <>
      <SimpleBanner>{banner}</SimpleBanner>
      <div className="mx-auto my-20 max-w-5xl">{children}</div>
      <div className="sticky bottom-0 flex w-full flex-col flex-wrap justify-center gap-4 bg-white p-4 py-8 shadow-[0_-4px_5px_-5px_gray] sm:flex-row">
        {actions}
      </div>
    </>
  );
};

export default SurveyLayout;

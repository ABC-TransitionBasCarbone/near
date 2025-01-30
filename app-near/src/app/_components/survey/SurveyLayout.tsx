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

      <div className="mx-auto max-w-[850px]">{children}</div>

      <div className="sticky bottom-0 flex w-full justify-center gap-4 bg-white py-4">
        {actions}
      </div>
    </>
  );
};

export default SurveyLayout;

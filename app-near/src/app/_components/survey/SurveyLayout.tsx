import { type ReactNode } from "react";
import SimpleBanner from "../_ui/SimpleBanner";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useSurveyStateContext } from "../_context/surveyStateContext";

interface SurveyLayoutProps {
  children: ReactNode;
  banner: ReactNode;
  actions?: ReactNode;
}
const SurveyLayout: React.FC<SurveyLayoutProps> = ({
  children,
  banner,
  actions,
}) => {
  const { data: session } = useSession();
  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.survey?.id,
  });
  const { step } = useSurveyStateContext();

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-grow">
        <SimpleBanner>{banner}</SimpleBanner>
        <div className="mx-3">{children}</div>
      </div>
      {actions && step === survey?.phase && (
        <div className="sticky bottom-0 flex w-full flex-col flex-wrap justify-center gap-4 bg-white p-4 py-8 shadow-[0_-4px_5px_-5px_gray] sm:flex-row">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SurveyLayout;

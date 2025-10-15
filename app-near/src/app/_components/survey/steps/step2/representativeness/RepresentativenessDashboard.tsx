import { type Session } from "next-auth";
import { api } from "../../../../../../trpc/react";
import { MetabaseIframeType } from "../../../../../../types/enums/metabase";
import MetabaseIframe from "../../../../_ui/MetabaseIframe";
import { env } from "~/env";

interface RepresentativenessProps {
  target: number;
  session: Session;
}

const Representativeness: React.FC<RepresentativenessProps> = ({
  target,
  session,
}) => {
  const { data: answserCount } = api.suAnswers.count.useQuery(
    session?.user?.survey?.id ?? 0,
    {
      enabled: !!session?.user?.survey?.id,
    },
  );

  const hasReachedMoreThanTargetPercentage = () => {
    return (
      (answserCount ?? 0) >=
      (target * parseInt(env.NEXT_PUBLIC_TARGET_PERCENTAGE_WARNING)) / 100
    );
  };

  if (hasReachedMoreThanTargetPercentage()) {
    return (
      <div>
        <MetabaseIframe
          iframeNumber={env.NEXT_PUBLIC_METABASE_PANEL_REPRESENTATIVNESS}
          iframeType={MetabaseIframeType.DASHBOARD}
          height="700px"
          params={{ surveyname: session.user.survey?.name }}
        />
      </div>
    );
  }
};

export default Representativeness;

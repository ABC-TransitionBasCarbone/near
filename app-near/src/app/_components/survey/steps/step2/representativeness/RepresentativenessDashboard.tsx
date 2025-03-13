import { type Session } from "next-auth";
import { api } from "../../../../../../trpc/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../../../types/enums/metabase";
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { data: answserCount } = api.suAnswers.count.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
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
          iframeNumber={MetabaseIFrameNumber.PANEL_REPRESENTATIVNESS}
          iframeType={MetabaseIframeType.DASHBOARD}
          height="700px"
        />
      </div>
    );
  }
};

export default Representativeness;

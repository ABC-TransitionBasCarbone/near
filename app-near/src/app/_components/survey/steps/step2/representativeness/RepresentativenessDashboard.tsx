import { type Session } from "next-auth";
import { api } from "../../../../../../trpc/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../../../types/enums/metabase";
import MetabaseIframe from "../../../../_ui/MetabaseIframe";

interface RepresentativenessProps {
  target: number;
  session: Session;
}

const Representativeness: React.FC<RepresentativenessProps> = ({
  target,
  session,
}) => {
  const { data: answserCount } = api.answers.count.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
    },
  );

  const hasReachedMoreThan75TargetPercentage = () => {
    return (answserCount ?? 0) >= (target * 75) / 100;
  };

  if (hasReachedMoreThan75TargetPercentage()) {
    return (
      <div>
        <MetabaseIframe
          iframeNumber={MetabaseIFrameNumber.PANEL_REPRESENTATIVNESS}
          iframeType={MetabaseIframeType.DASHBOARD}
          height="900px"
        />
      </div>
    );
  }
};

export default Representativeness;

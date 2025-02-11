import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";
import MetabaseIframe from "../../../_ui/MetabaseIframe";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../../types/enums/metabase";

interface RepresentativenessProps {
  target: number;
}

const Representativeness: React.FC<RepresentativenessProps> = ({ target }) => {
  const { data: session } = useSession();

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

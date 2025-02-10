import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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

  const hasReached75TargetPercentage = () => {
    return (answserCount ?? 0) >= (target * 75) / 100;
  };

  if (hasReached75TargetPercentage()) {
    return <div>Reached !</div>;
  }
};

export default Representativeness;

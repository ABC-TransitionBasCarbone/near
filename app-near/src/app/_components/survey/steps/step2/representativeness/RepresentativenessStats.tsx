import { type Session } from "next-auth";
import { api } from "../../../../../../trpc/react";
import { CategoryLabels } from "../../../../../../types/enums/category";

interface RepresentativenessStats {
  session: Session;
}

const RepresentativenessStats: React.FC<RepresentativenessStats> = ({
  session,
}) => {
  const THRESHOLD_VALUE = -3.5;

  const { data: stats } = api.answers.representativeness.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
    },
  );

  const getBelowThresholdValues = (
    criteria: Record<string, number>,
    threshold: number,
  ) => {
    return Object.fromEntries(
      Object.entries(criteria).filter(([_, value]) => value < threshold),
    );
  };

  if (!stats) {
    return null;
  }

  const filteredData = getBelowThresholdValues(stats, THRESHOLD_VALUE);

  if (!filteredData || Object.keys(filteredData).length === 0) {
    return null;
  }

  return (
    <div className="m-auto px-5">
      {Object.entries(filteredData).map(([key, value]) => (
        <p key={key}>
          Vous avez interrogé trop&nbsp;
          {CategoryLabels[key as keyof typeof CategoryLabels]} (
          {Math.abs(value)}% en plus par rapport aux chiffres de l&apos;INSEE)
        </p>
      ))}
    </div>
  );
};

export default RepresentativenessStats;

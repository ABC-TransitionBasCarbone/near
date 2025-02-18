import {
  getBelowThresholdValues,
  THRESHOLD_VALUE,
} from "~/app/_services/su-surveys/threshold";
import { CategoryLabels } from "../../../../../../types/enums/category";
import { type CategoryStats } from "~/types/SuAnswer";

interface RepresentativenessStats {
  categoryStats?: CategoryStats;
}

const RepresentativenessStats: React.FC<RepresentativenessStats> = ({
  categoryStats,
}) => {
  if (!categoryStats) {
    return null;
  }

  const filteredData = getBelowThresholdValues(categoryStats, THRESHOLD_VALUE);

  if (!filteredData || Object.keys(filteredData).length === 0) {
    return null;
  }

  return (
    <div className="m-auto mt-10 px-5">
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

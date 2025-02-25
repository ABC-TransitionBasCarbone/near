import {
  getBelowThresholdValues,
  THRESHOLD_VALUE,
} from "~/shared/services/su-surveys/threshold";
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
    <div className="m-auto mt-10 flex w-fit flex-col gap-4 rounded-lg bg-brownLight p-5">
      <div className="mx-auto h-auto w-7">
        <img src="/icons/warning-orange.svg" alt="" />
      </div>
      <div>
        Vous avez interrogé suffisamment des catégories ci-dessous, attention à
        ne pas en interroger d’avantage :
        <ul className="mt-3 list-inside list-disc">
          {Object.entries(filteredData).map(([key]) => (
            <li key={key}>
              {CategoryLabels[key as keyof typeof CategoryLabels]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RepresentativenessStats;

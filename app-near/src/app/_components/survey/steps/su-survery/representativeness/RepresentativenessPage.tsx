import { useEffect, useState } from "react";
import RepresentativenessDashboard from "./RepresentativenessDashboard";
import SampleRadioOptions from "./SampleRadioOptions";
import { useSession } from "next-auth/react";
import RepresentativenessStats from "./RepresentativenessStats";
import { type CategoryStats } from "~/types/SuAnswer";
import { type Quartier, type Survey } from "@prisma/client";

interface RepresentativenessPageProps {
  categoryStats?: CategoryStats | null;
  survey: Survey & { quartier: Quartier | null };
}
const RepresentativenessPage: React.FC<RepresentativenessPageProps> = ({
  categoryStats,
  survey,
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: session } = useSession();

  const roundToUpper50 = (value: number): number => {
    return Math.ceil(value / 50) * 50;
  };

  useEffect(() => {
    if (survey?.sampleTarget) {
      const rounded = roundToUpper50(survey?.sampleTarget);
      setSelected(rounded);
    }
  }, [survey?.sampleTarget]);

  if (!session) {
    return <p>Pas de session utilisateur</p>;
  }

  if (!survey?.quartier) {
    return <p>Erreur : Pas de quartier défini pour cette enquête</p>;
  }

  return (
    <div className="mx-6 my-8 flex flex-col gap-8">
      <SampleRadioOptions
        selected={selected}
        setSelected={setSelected}
        targetOptions={[
          survey.quartier.population_sum_threshold_5p,
          survey.quartier.population_sum_threshold_4_5p,
          survey.quartier.population_sum_threshold_4p,
          survey.quartier.population_sum_threshold_3p,
        ]}
        session={session}
      ></SampleRadioOptions>

      {selected !== null && (
        <>
          {categoryStats && (
            <RepresentativenessStats categoryStats={categoryStats} />
          )}
          <RepresentativenessDashboard target={selected} session={session} />
        </>
      )}
    </div>
  );
};

export default RepresentativenessPage;

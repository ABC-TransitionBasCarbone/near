import { useEffect, useState } from "react";
import RepresentativenessDashboard from "./RepresentativenessDashboard";
import SampleRadioOptions from "./SampleRadioOptions";
import { useSession } from "next-auth/react";
import { api } from "../../../../../../trpc/react";

const RepresentativenessPage: React.FC = ({}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const { data: session } = useSession();

  const { data: survey, isLoading } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  const roundToUpper50 = (value: number): number => {
    return Math.ceil(value / 50) * 50;
  };

  useEffect(() => {
    if (survey?.sampleTarget) {
      const rounded = roundToUpper50(survey?.sampleTarget);
      setSelected(rounded);
    }
  }, [survey?.sampleTarget]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <p>Pas de session utilisateur</p>;
  }

  if (!survey?.quartier) {
    return <p>Erreur : Pas de quartier défini pour cette enquête</p>;
  }

  return (
    <div className="mx-6">
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
        <RepresentativenessDashboard target={selected} session={session} />
      )}
    </div>
  );
};

export default RepresentativenessPage;

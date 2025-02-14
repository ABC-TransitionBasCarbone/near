import { useEffect, useState } from "react";
import RepresentativenessDashboard from "./RepresentativenessDashboard";
import SampleRadioOptions from "./SampleRadioOptions";
import { useSession } from "next-auth/react";
import { api } from "../../../../../../trpc/react";
import RepresentativenessStats from "./RepresentativenessStats";

const RepresentativenessPage: React.FC = ({}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const { data: session } = useSession();

  const { data: survey, isLoading } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  useEffect(() => {
    if (survey?.sampleTarget) {
      setSelected(Math.ceil(survey?.sampleTarget / 50) * 50);
    }
  }, [survey?.sampleTarget]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Pas de session utilisateur</div>;
  }

  if (!survey?.quartier) {
    return <div>Erreur : Pas de quartier défini pour cette enquête</div>;
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
        <>
          <RepresentativenessStats session={session} />
          <RepresentativenessDashboard target={selected} session={session} />
        </>
      )}
    </div>
  );
};

export default RepresentativenessPage;

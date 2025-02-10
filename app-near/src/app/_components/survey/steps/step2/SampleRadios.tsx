import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import Representativeness from "./Representativeness";

const SampleRadios: React.FC = ({}) => {
  const { data: session } = useSession();

  const { data: survey, isLoading } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  const [selected, setSelected] = useState(200);

  useEffect(() => {
    if (survey?.sampleTarget) {
      setSelected(Math.ceil(survey?.sampleTarget / 50) * 50);
    }
  }, [survey?.sampleTarget]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!survey?.quartier) {
    return <div>Erreur : Pas de quartier défini pour cette enquête</div>;
  }

  const updateSurveyMutation = api.surveys.update.useMutation();

  return (
    <div>
      <div className="m-auto flex max-w-fit flex-1 items-start rounded border border-grayLight p-2 px-5">
        <div className="my-auto mr-4 flex">
          Combien de personnes voulez-vous interroger ?
        </div>
        <ul className="flex flex-wrap gap-4">
          {[
            survey.quartier.population_sum_threshold_5p,
            survey.quartier.population_sum_threshold_4_5p,
            survey.quartier.population_sum_threshold_4p,
            survey.quartier.population_sum_threshold_3p,
          ]
            .map((sampleValue) => Math.ceil(sampleValue / 50) * 50)
            .map((option) => (
              <li key={option.toString()}>
                <div className="flex w-fit items-center rounded p-2">
                  <input
                    id={option.toString()}
                    type="radio"
                    value={option}
                    name={"sample"}
                    checked={selected === option}
                    className="focus:ring-gray-500 peer h-5 w-5 cursor-pointer text-grayLight checked:text-white focus:ring-1"
                    onChange={() => {
                      setSelected(option);
                      return (
                        session?.user?.surveyId &&
                        updateSurveyMutation.mutateAsync({
                          surveyId: session?.user?.surveyId,
                          data: {
                            sampleTarget: option,
                          },
                        })
                      );
                    }}
                  />
                  <label
                    htmlFor={option.toString()}
                    className="cursor-pointer ps-2 text-sm text-black"
                  >
                    {option}
                  </label>
                </div>
              </li>
            ))}
        </ul>
      </div>
      <Representativeness target={selected} />
    </div>
  );
};

export default SampleRadios;

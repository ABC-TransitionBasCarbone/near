import { type Session } from "next-auth";
import React, { type Dispatch, type SetStateAction } from "react";
import { api } from "~/trpc/react";

interface SampleRadioOptionsProps {
  selected: number | null;
  setSelected: Dispatch<SetStateAction<number | null>>;
  targetOptions: number[];
  session: Session;
}

const SampleRadioOptions: React.FC<SampleRadioOptionsProps> = ({
  selected,
  setSelected,
  targetOptions,
  session,
}) => {
  const updateSurveyMutation = api.surveys.update.useMutation();

  return (
    <div className="m-auto flex max-w-fit flex-1 items-start rounded border border-grayLight p-2 px-5">
      <div className="my-auto mr-4 flex">
        Combien de personnes voulez-vous interroger ?
      </div>
      <ul className="flex flex-wrap gap-4">
        {targetOptions
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
  );
};

export default SampleRadioOptions;

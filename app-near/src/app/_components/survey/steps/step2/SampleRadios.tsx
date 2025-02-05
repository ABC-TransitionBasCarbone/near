import { useState } from "react";

const SampleRadios: React.FC = ({}) => {
  const options = [200, 400, 500, 600];

  const [selected, setSelected] = useState("200");

  return (
    <div className="m-auto flex max-w-fit flex-1 items-start rounded border border-grayLight p-2 px-5">
      <div className="my-auto mr-4 flex">
        Combien de personnes voulez-vous interroger ?
      </div>
      <ul className="flex flex-wrap gap-4">
        {options.map((option) => (
          <li key={option}>
            <div className="flex w-fit items-center rounded p-2">
              <input
                id={option.toString()}
                type="radio"
                value={option}
                checked={selected === option.toString()}
                className="focus:ring-gray-500 peer h-5 w-5 cursor-pointer text-grayLight checked:text-white focus:ring-1"
                onChange={() => {
                  setSelected(option.toString());
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

export default SampleRadios;

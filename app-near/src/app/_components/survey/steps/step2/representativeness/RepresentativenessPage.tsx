import { useState } from "react";
import RepresentativenessDashboard from "./RepresentativenessDashboard";
import SampleRadioOptions from "./SampleRadioOptions";

const RepresentativenessPage: React.FC = ({}) => {
  const [selected, setSelected] = useState(400);

  return (
    <div className="mx-6">
      <SampleRadioOptions
        selected={selected}
        setSelected={setSelected}
      ></SampleRadioOptions>
      (selected ? & <RepresentativenessDashboard target={selected} />)
    </div>
  );
};

export default RepresentativenessPage;

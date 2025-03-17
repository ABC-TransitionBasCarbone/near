"use client";

import { useState } from "react";
import BroadcastingLayout from "../../broadcasting/BroadcastingLayout";
import RepresentativenessLayout from "./representativeness/RepresentativenessLayout";
import { SurveyType } from "~/types/enums/survey";

const SuSurvery: React.FC = () => {
  const [toggleBroadcastingPage, setToggleBroadcastingPage] = useState(false);

  if (toggleBroadcastingPage) {
    return (
      <BroadcastingLayout
        setToggleBroadcastingPage={setToggleBroadcastingPage}
        surveyType={SurveyType.SU}
      ></BroadcastingLayout>
    );
  }
  return (
    <RepresentativenessLayout
      setToggleBroadcastingPage={setToggleBroadcastingPage}
    ></RepresentativenessLayout>
  );
};

export default SuSurvery;

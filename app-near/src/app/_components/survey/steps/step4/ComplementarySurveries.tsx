"use client";

import { useState } from "react";
import RespondentsNumberLayout from "./RespondentsNumberLayout";
import { type SurveyType } from "~/types/enums/broadcasting";
import BroadcastingLayout from "../../broadcasting/BroadcastingLayout";

const ComplementarySurveries: React.FC = () => {
  const [toggleBroadcastingPage, setToggleBroadcastingPage] = useState(false);
  const [surveyType, setSurveyType] = useState<SurveyType>();

  if (toggleBroadcastingPage && surveyType) {
    return (
      <BroadcastingLayout
        setToggleBroadcastingPage={setToggleBroadcastingPage}
        surveyType={surveyType}
      ></BroadcastingLayout>
    );
  }

  return (
    <RespondentsNumberLayout
      setToggleBroadcastingPage={setToggleBroadcastingPage}
      setSurveyType={setSurveyType}
    />
  );
};

export default ComplementarySurveries;

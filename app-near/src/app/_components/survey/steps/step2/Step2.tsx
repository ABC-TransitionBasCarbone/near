"use client";

import { useState } from "react";
import Broadcasting from "./Broadcasting";
import SurveyInProgress from "./SurveyInProgress";

const Step2: React.FC = () => {
  const [toggleBroadcastingPage, setToggleBroadcastingPage] = useState(false);

  if (toggleBroadcastingPage) {
    return (
      <Broadcasting
        setToggleBroadcastingPage={setToggleBroadcastingPage}
      ></Broadcasting>
    );
  } else {
    return (
      <SurveyInProgress
        setToggleBroadcastingPage={setToggleBroadcastingPage}
      ></SurveyInProgress>
    );
  }
};

export default Step2;

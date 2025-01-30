"use client";

import { useSurveyStateContext } from "../_context/surveyStateContext";
import { surveyConfig } from "./steps/config";

const SurveyPage: React.FC = () => {
  const { step } = useSurveyStateContext();

  if (!step) {
    return null;
  }

  return <>{surveyConfig[step].component}</>;
};

export default SurveyPage;

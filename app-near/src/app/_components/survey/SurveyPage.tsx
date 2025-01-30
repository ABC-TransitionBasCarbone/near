"use client";

import { surveyConfig } from "./surveyPage.config";
import { useSurveyStateContext } from "../_context/surveyStateContext";

const SurveyPage: React.FC = () => {
  const { step } = useSurveyStateContext();

  if (!step) {
    return null;
  }

  return <>{surveyConfig[step].component}</>;
};

export default SurveyPage;

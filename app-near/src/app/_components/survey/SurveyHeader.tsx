"use client";

import { type SurveyStep } from "~/types/enums/surveyStep";
import ProgressBar from "../progress-bar/Progressbar";
import { surveyConfig, surveySteps } from "./surveyPage.config";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useSurveyStateContext } from "../_context/surveyStateContext";

const SurveyHeader = () => {
  const { data: session } = useSession();

  const { step, updateStep } = useSurveyStateContext();

  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  useEffect(() => {
    if (survey) {
      updateStep(survey.phase as SurveyStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey]);

  if (!step || !survey) {
    return null;
  }

  return (
    <div className="mx-12 my-8 flex flex-wrap items-center justify-center gap-4">
      <img src="/logos/logo_near.svg" alt="" />
      <nav>
        <ProgressBar
          isActive={surveyConfig[survey.phase as SurveyStep].isActive}
          step={step}
          setStep={updateStep}
          steps={surveySteps}
          maxActiveStep={survey.phase as SurveyStep}
        />
      </nav>
      <div className="flex gap-2">
        <img src="/icons/building.svg" alt="" />
        {survey.name}
      </div>
    </div>
  );
};

export default SurveyHeader;

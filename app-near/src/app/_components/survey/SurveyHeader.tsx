"use client";

import ProgressBar from "../progress-bar/Progressbar";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useSurveyStateContext } from "../_context/surveyStateContext";
import { surveyConfig, surveySteps } from "./steps/config";
import { useEffect } from "react";

const SurveyHeader = () => {
  const { data: session } = useSession();

  const { step, updateStep } = useSurveyStateContext();

  const { data: survey, refetch } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  useEffect(() => {
    if (step) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  if (!step || !survey) {
    return null;
  }

  return (
    <div className="mx-2 my-8 flex flex-wrap items-center justify-center gap-4 sm:mx-12">
      <div className="flex w-full items-center justify-between gap-2 sm:w-fit sm:gap-4">
        <img src="/logos/logo_near.svg" alt="" />
        <div className="flex gap-2 sm:hidden">
          <img src="/icons/building.svg" alt="" />
          <span>{survey.name}</span>
        </div>
      </div>
      <nav className="flex-grow">
        <ProgressBar
          isActive={surveyConfig[survey.phase].isActive}
          step={step}
          setStep={updateStep}
          steps={surveySteps}
          maxActiveStep={survey.phase}
        />
      </nav>
      <div className="hidden gap-2 sm:flex">
        <img src="/icons/building.svg" alt="" />
        {survey.name}
      </div>
    </div>
  );
};

export default SurveyHeader;

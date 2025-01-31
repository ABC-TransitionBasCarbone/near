"use client";

import { createContext, type ReactNode, useContext, useState } from "react";
import { type SurveyStep } from "~/types/enums/surveyStep";

interface SurveyStateContextType {
  step?: SurveyStep;
  updateStep: (newStep: SurveyStep) => void;
}

const SurveyStateContext = createContext<SurveyStateContextType>({
  step: undefined,
  updateStep: () => null,
});

export function SurveyStateProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<SurveyStep>();

  const updateStep = (newStep: SurveyStep) => {
    setStep(newStep);
  };

  return (
    <SurveyStateContext.Provider value={{ step, updateStep }}>
      {children}
    </SurveyStateContext.Provider>
  );
}

export const useSurveyStateContext = () => {
  return useContext(SurveyStateContext);
};

"use client";

import { type SurveyPhase } from "@prisma/client";
import { createContext, type ReactNode, useContext, useState } from "react";

interface SurveyStateContextType {
  step?: SurveyPhase;
  updateStep: (newStep: SurveyPhase) => void;
}

const SurveyStateContext = createContext<SurveyStateContextType>({
  step: undefined,
  updateStep: () => null,
});

export function SurveyStateProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<SurveyPhase>();

  const updateStep = (newStep: SurveyPhase) => {
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

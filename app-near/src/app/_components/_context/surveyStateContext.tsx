"use client";

import { type SurveyPhase } from "@prisma/client";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "~/trpc/react";

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

  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: step === undefined,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (survey?.phase) {
      updateStep(survey?.phase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [survey]);

  return (
    <SurveyStateContext.Provider value={{ step, updateStep }}>
      {children}
    </SurveyStateContext.Provider>
  );
}

export const useSurveyStateContext = () => {
  return useContext(SurveyStateContext);
};

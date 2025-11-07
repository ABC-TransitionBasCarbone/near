import { type Step, type StepParams } from "~/types/Step";
import NeighborhoodInformations from "./step1/NeighborhoodInformations";
import Exploration from "./step3/Exploration";
import SuSurvery from "./step2/SuSurvery";
import { SurveyPhase } from "@prisma/client";
import ComplementarySurveries from "./step4/ComplementarySurveries";
import Results from "./step5/Results";

export const surveySteps: Record<SurveyPhase, Step> = {
  [SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION]: {
    label: "Informations sur le quartier",
    number: 1,
  },
  [SurveyPhase.STEP_2_SU_SURVERY]: {
    label: "Enquête sur les Sphères d'Usages",
    number: 2,
  },
  [SurveyPhase.STEP_3_SU_EXPLORATION]: {
    label: "Découverte et personnalisation",
    number: 3,
  },
  [SurveyPhase.STEP_4_ADDITIONAL_SURVEY]: {
    label: "3 enquêtes complémentaires",
    number: 4,
  },
  [SurveyPhase.STEP_5_RESULTS]: {
    label: "Résultats finaux et analyses",
    number: 5,
  },
};

export const surveyConfig: Record<SurveyPhase, StepParams<SurveyPhase>> = {
  [SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION]: {
    component: <NeighborhoodInformations />,
    previouxStep: SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION,
    nextStep: SurveyPhase.STEP_2_SU_SURVERY,
    buttonType: "button",
    isActive: [],
  },
  [SurveyPhase.STEP_2_SU_SURVERY]: {
    component: <SuSurvery />,
    previouxStep: SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION,
    nextStep: SurveyPhase.STEP_3_SU_EXPLORATION,
    buttonType: "button",
    isActive: [SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION],
  },
  [SurveyPhase.STEP_3_SU_EXPLORATION]: {
    component: <Exploration />,
    previouxStep: SurveyPhase.STEP_2_SU_SURVERY,
    nextStep: SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    buttonType: "button",
    isActive: [
      SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION,
      SurveyPhase.STEP_2_SU_SURVERY,
    ],
  },
  [SurveyPhase.STEP_4_ADDITIONAL_SURVEY]: {
    component: <ComplementarySurveries />,
    previouxStep: SurveyPhase.STEP_3_SU_EXPLORATION,
    nextStep: SurveyPhase.STEP_5_RESULTS,
    buttonType: "button",
    isActive: [
      SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION,
      SurveyPhase.STEP_2_SU_SURVERY,
      SurveyPhase.STEP_3_SU_EXPLORATION,
    ],
  },
  [SurveyPhase.STEP_5_RESULTS]: {
    component: <Results />,
    previouxStep: SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    nextStep: SurveyPhase.STEP_5_RESULTS,
    buttonType: "button",
    isActive: [
      SurveyPhase.STEP_1_NEIGHBORHOOD_INFORMATION,
      SurveyPhase.STEP_2_SU_SURVERY,
      SurveyPhase.STEP_3_SU_EXPLORATION,
      SurveyPhase.STEP_4_ADDITIONAL_SURVEY,
    ],
  },
};

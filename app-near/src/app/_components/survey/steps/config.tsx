import { SurveyStep } from "~/types/enums/surveyStep";
import { type Step, type StepParams } from "~/types/Step";
import NeighborhoodInformations from "./NeighborhoodInformations";

export const surveySteps: Record<SurveyStep, Step> = {
  [SurveyStep.STEP_1]: { label: "Informations sur le quartier", number: 1 },
  [SurveyStep.STEP_2]: { label: "Enquête sur les Sphères d'Usages", number: 2 },
  [SurveyStep.STEP_3]: { label: "Découverte et personnalisation", number: 3 },
  [SurveyStep.STEP_4]: { label: "3 enquêtes complémentaires", number: 4 },
  [SurveyStep.STEP_5]: { label: "Résultats finaux et analyses", number: 5 },
};

export const surveyConfig: Record<SurveyStep, StepParams<SurveyStep>> = {
  [SurveyStep.STEP_1]: {
    title: "Information sur le quartier",
    component: <NeighborhoodInformations />,
    previouxStep: SurveyStep.STEP_1,
    nextStep: SurveyStep.STEP_2,
    buttonType: "button",
    isActive: [],
  },
  [SurveyStep.STEP_2]: {
    title: "Fiche de poste",
    component: <>Step 2</>,
    previouxStep: SurveyStep.STEP_1,
    nextStep: SurveyStep.STEP_3,
    buttonType: "button",
    isActive: [SurveyStep.STEP_1],
  },
  [SurveyStep.STEP_3]: {
    title: "Niveau d'études et d'expérience",
    component: <>Step 3</>,
    previouxStep: SurveyStep.STEP_2,
    nextStep: SurveyStep.STEP_4,
    buttonType: "button",
    isActive: [SurveyStep.STEP_1, SurveyStep.STEP_2],
  },
  [SurveyStep.STEP_4]: {
    title: "Expertise en cybersécurité (1/2) : les thématiques",
    component: <>Step 4</>,
    previouxStep: SurveyStep.STEP_3,
    nextStep: SurveyStep.STEP_5,
    buttonType: "button",
    isActive: [SurveyStep.STEP_1, SurveyStep.STEP_2, SurveyStep.STEP_3],
  },
  [SurveyStep.STEP_5]: {
    title: "Expertise en cybersécurité (2/2) : les compétences",
    component: <>Step 5</>,
    previouxStep: SurveyStep.STEP_4,
    nextStep: SurveyStep.STEP_5,
    buttonType: "button",
    isActive: [
      SurveyStep.STEP_1,
      SurveyStep.STEP_2,
      SurveyStep.STEP_3,
      SurveyStep.STEP_4,
    ],
  },
};

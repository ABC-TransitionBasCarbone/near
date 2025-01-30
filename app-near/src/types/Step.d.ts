import { type ReactNode } from "react";
import { type ButtonType } from "~/app/_components/_ui/Button";

export interface Step {
  label: string;
  number: number;
}

export interface StepParams<StepType> {
  component: ReactNode;
  nextStep: StepType;
  previouxStep: StepType;
  buttonType: ButtonType;
  isActive: StepType[];
}

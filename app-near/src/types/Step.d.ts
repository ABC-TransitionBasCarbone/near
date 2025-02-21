import { type ReactNode } from "react";
import { type ButtonType } from "~/app/_components/_ui/Button";

export interface Step {
  label: string;
  number: number;
}

export interface StepParams<T> {
  component: ReactNode;
  nextStep: T;
  previouxStep: T;
  buttonType: ButtonType;
  isActive: T[];
}

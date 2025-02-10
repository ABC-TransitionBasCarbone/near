"use client";

import { type Step } from "~/types/Step";

interface ProgressBarProps<T extends string> {
  steps: Record<T, Step>;
  isActive: string[];
  step: T;
  setStep: (value: T) => void;
  maxActiveStep: T;
}

const ProgressBar = <T extends string>({
  steps,
  isActive,
  setStep,
  step,
  maxActiveStep,
}: ProgressBarProps<T>): JSX.Element | null => {
  const isCurrentStep = (value: T) => value === step;

  const isActiveStep = (value: T) => {
    if (maxActiveStep === value) {
      return true;
    }

    if (isActive.includes(value)) {
      return true;
    }
    return false;
  };

  const handleStepClick = (step: T) => {
    if (isActiveStep(step)) {
      setStep(step);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <ul className="flex flex-wrap md:gap-3">
        {Object.entries<Step>(steps).map(([stepItem, stepData]) => (
          <li
            key={stepItem}
            className="flex flex-1 items-center gap-2 text-sm after:text-xl after:text-grayLight [&:not(:last-child)]:after:content-['>']"
          >
            <button
              type="button"
              className={`${isCurrentStep(stepItem as T) ? "bg-blue" : "bg-transparent"} flex w-fit cursor-pointer items-center gap-2 rounded-lg border-none px-3 py-1 text-left outline-none hover:ring-0 hover:ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0`}
              onClick={() => handleStepClick(stepItem as T)}
              disabled={!isActiveStep(stepItem as T)}
            >
              <div
                className={`rounded-full ${isActiveStep(stepItem as T) ? "bg-blue" : "bg-grayLight"} ${isCurrentStep(stepItem as T) ? "bg-white text-blue" : "text-white"} flex h-[25px] min-w-[25px] items-center justify-center`}
              >
                <div className="font-bold">{stepData.number}</div>
              </div>
              <div
                className={`${isCurrentStep(stepItem as T) ? "flex text-white" : "hidden sm:block sm:grow"} ${isActiveStep(stepItem as T) ? "text-blue" : "text-grayLight"}`}
              >
                {stepData.label}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgressBar;

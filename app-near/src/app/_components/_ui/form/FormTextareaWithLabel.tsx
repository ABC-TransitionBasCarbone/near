import React, { useEffect, useRef, type ReactNode } from "react";
import {
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { useDebounced } from "../hooks/useDebounced";
import FormRequiredLabel from "./FormRequiredLabel";
import FormErrorMessage from "./FormErrorMessage";

type FormTextareaWithLabelProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  label: string | ReactNode;
  required?: boolean;
  hint?: string | ReactNode;
  error?: FieldError;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange?: (...args: any[]) => Promise<void>;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  maxLengthRatio?: number;
};

const FormTextareaWithLabel = <TFieldValues extends FieldValues>({
  name,
  label,
  required = false,
  hint,
  handleChange,
  placeholder,
  rows,
  maxLength,
  maxLengthRatio = 0.1,
}: FormTextareaWithLabelProps<TFieldValues>) => {
  const { control } = useFormContext();
  const value = useWatch({ control, name });
  const debouncedValue = useDebounced(value, 1000);
  const counterId = `${name}-counter`;

  const prevValue = useRef(value);
  useEffect(() => {
    // prevent to display error at first load.
    if (prevValue.current === debouncedValue) {
      return;
    }
    prevValue.current = debouncedValue;

    if (handleChange) {
      void handleChange(name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <Controller
      key={name}
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const currentLength = (field.value as string | undefined)?.length ?? 0;
        const isNearLimit = maxLength
          ? maxLength - currentLength <= Math.ceil(maxLength * maxLengthRatio)
          : false;
        const describedBy = [
          `${name}-error`,
          `${name}-hint`,
          maxLength ? counterId : undefined,
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div>
            {required ? (
              <FormRequiredLabel htmlFor={name}>{label}</FormRequiredLabel>
            ) : (
              <label className="mb-1 block" htmlFor={name}>
                {label}
              </label>
            )}
            {hint && (
              <div id={`${name}-hint`} className="my-2 block text-sm">
                {hint}
              </div>
            )}
            <div className="mb-6">
              <textarea
                id={name}
                className={`${rows ? "" : "h-28"} w-full resize-none rounded-md border bg-white p-2 text-sm ${
                  fieldState.error?.message ? "border-red" : "border-gray-300"
                }`}
                aria-describedby={describedBy || undefined}
                aria-required={required}
                aria-invalid={!!fieldState.error}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
                rows={rows}
                maxLength={maxLength}
              />
              {maxLength && (
                <div
                  id={counterId}
                  aria-live="polite"
                  className={`mt-1 text-right text-xs ${
                    isNearLimit ? "text-red font-semibold" : "text-gray-500"
                  }`}
                >
                  {currentLength} / {maxLength} caractères
                </div>
              )}
            </div>
            <FormErrorMessage id={`${name}-error`} error={fieldState.error} />
          </div>
        );
      }}
    />
  );
};

export default FormTextareaWithLabel;

"use client";

import {
  Controller,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import AsyncSelect from "react-select/async";
import FormErrorMessage from "./FormErrorMessage";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface FormMultiSelectAsyncProps<FormValues extends FieldValues> {
  name: Path<FormValues>;
  loadOptions: (inputValue: string) => Promise<SelectOption[]>;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

const FormMultiSelectAsync = <FormValues extends FieldValues>({
  name,
  loadOptions,
  placeholder,
  label,
  required,
}: FormMultiSelectAsyncProps<FormValues>) => {
  const { control } = useFormContext<FormValues>();

  return (
    <div>
      {label && (
        <div className="mb-2 mt-6 flex w-full items-center justify-between">
          <label
            className="font-bold"
            htmlFor={name}
          >{`${label}  ${required ? " *" : ""}`}</label>
        </div>
      )}

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <div className="hover:ring-indigo-400 focus-within:ring-indigo-400 mt-2 flex w-full items-center rounded border border-grayLight transition duration-300 focus-within:ring-2 hover:ring-2">
              <AsyncSelect<SelectOption, true>
                {...field}
                isMulti
                cacheOptions
                defaultOptions
                placeholder={placeholder}
                loadOptions={loadOptions}
                onChange={(val) => field.onChange(val)}
                className="mx-2 flex-1"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "none",
                    boxShadow: "none",
                  }),
                }}
              />
            </div>

            <FormErrorMessage id={`error-${name}`} error={fieldState.error} />
          </>
        )}
      />
    </div>
  );
};

export default FormMultiSelectAsync;

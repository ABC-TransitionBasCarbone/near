"use client";

import Link from "next/link";
import { type HTMLInputTypeAttribute, type ReactNode, useState } from "react";
import {
  type FieldError,
  type FieldValues,
  type Path,
  useFormContext,
} from "react-hook-form";
import { renderIcon } from "../utils/renderIcon";
import FormErrorMessage from "./FormErrorMessage";

interface FormInputProps<T extends FieldValues> {
  label?: string;
  labelLink?: {
    redirect: string;
    label: string;
  };
  id: string;
  name: Path<T>;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  icon?: string | ReactNode;
  required?: boolean;
  defaultValue?: string;
  description?: string;
  disabled?: boolean;
  tabIndex?: number;
  min?: number | string;
  max?: number | string;
  maxLength?: number;
}

const FormInput = <T extends FieldValues>({
  id,
  name,
  type,
  placeholder,
  label,
  icon = undefined,
  labelLink = undefined,
  required,
  defaultValue,
  description,
  disabled = false,
  tabIndex = 0,
  min = undefined,
  max = undefined,
  maxLength = 255,
}: FormInputProps<T>): JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const [inputType, setInputType] = useState<HTMLInputTypeAttribute>(type);

  const togglePasswordVisibility = (): void => {
    if (inputType === "text") {
      setInputType("password");
    }
    if (inputType === "password") {
      setInputType("text");
    }
  };

  return (
    <div className="flex max-w-full flex-1 flex-col items-start">
      {label && (
        <div className="mt-6 flex w-full items-center justify-between">
          <label
            className="font-bold"
            htmlFor={id}
          >{`${label}  ${required ? " *" : ""}`}</label>
          {labelLink && (
            <Link
              className="text-xs font-bold text-blue"
              href={labelLink.redirect}
            >
              {labelLink.label}
            </Link>
          )}
        </div>
      )}
      {description && <p className="my-2 text-sm">{description}</p>}
      <div className="hover:ring-indigo-400 focus-within:ring-indigo-400 mt-2 flex w-full items-center rounded border border-grayLight transition duration-300 focus-within:ring-2 hover:ring-2">
        <div className="mx-2">{renderIcon(icon, 24)}</div>
        <input
          {...register(name)}
          id={id}
          name={name}
          type={inputType}
          className="disabled:text-gray-400 mx-2 my-2 w-full flex-1 outline-none disabled:cursor-not-allowed"
          placeholder={placeholder}
          autoComplete={inputType}
          maxLength={maxLength}
          defaultValue={defaultValue}
          aria-disabled={disabled}
          disabled={disabled}
          tabIndex={tabIndex}
          min={min}
          max={max}
        />
        {type === "password" && (
          <button
            type="button"
            className="ml-2 focus:outline-none"
            onClick={togglePasswordVisibility}
            tabIndex={tabIndex + 1}
          >
            {inputType !== "password" ? (
              <img
                className="mx-2"
                src="/icons/eye-slash.svg"
                alt="voir mon mot de passe"
                height={24}
                width={24}
              />
            ) : (
              <img
                className="mx-2"
                src="/icons/eye.svg"
                alt="voir mon mot de passe"
                height={24}
                width={24}
              />
            )}
          </button>
        )}
      </div>
      <FormErrorMessage
        id={`error-${name}`}
        error={errors[name] as FieldError}
      />
    </div>
  );
};

export default FormInput;

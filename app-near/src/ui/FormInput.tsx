'use client';

import Link from 'next/link';
import { HTMLInputTypeAttribute, ReactNode, useState } from 'react';
import { FieldValues, Path, useFormContext } from 'react-hook-form';
import { renderIcon } from './utils/renderIcon';

interface FormInputProps <T>{
  label?: string,
  labelLink?: {
    redirect: string,
    label: string,
  },
  id: string,
  name: Path<T>,
  type: HTMLInputTypeAttribute,
  placeholder?: string,
  icon?: string|ReactNode,
  required?: boolean,
  defaultValue?:string,
  description?: string,
  disabled?: boolean,
  tabIndex?: number,
  min?: number | string,
  max?: number | string,
  maxLength?: number,
}

const FormInput = <T extends FieldValues, >({
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
  const { register, formState: { errors } } = useFormContext<T>();

  const [inputType, setInputType] = useState<HTMLInputTypeAttribute>(type);

  const togglePasswordVisibility = (): void => {
    if (inputType === 'text') {
      setInputType('password');
    }
    if (inputType === 'password') {
      setInputType('text');
    }
  };

  const errorMessage = errors[name]?.message as unknown as string;

  return (
    <div className="flex flex-col flex-1 items-start max-w-full">
      {label && (
        <div className="flex justify-between items-center mt-6 w-full">
          <label className="font-bold" htmlFor={id}>{`${label}  ${required ? ' *' : ''}`}</label>
          {labelLink && (
            <Link
              className="text-xs text-blue font-bold"
              href={labelLink.redirect}
            >
              {labelLink.label}
            </Link>
          )}
        </div>
      )}
      {description && (
        <p className="text-sm my-2">{description}</p>
      )}
      <div
        className="flex items-center border border-grayLight rounded
                hover:ring-2 hover:ring-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400
                transition duration-300 mt-2 w-full"
      >
        <div className="mx-2">
          {renderIcon(icon, 24)}
        </div>
        <input
          {...register(name)}
          id={id}
          name={name}
          type={inputType}
          className="flex-1 outline-none mx-2 my-2 w-full disabled:text-gray-400 disabled:cursor-not-allowed"
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
        {type === 'password' && (
          <button
            type="button"
            className="focus:outline-none ml-2"
            onClick={togglePasswordVisibility}
            tabIndex={tabIndex + 1}
          >
            {inputType !== 'password' ? (
              <img className="mx-2" src="/icons/eye-slash.svg" alt="voir mon mot de passe" height={24} width={24} />
            ) : (
              <img className="mx-2" src="/icons/eye.svg" alt="voir mon mot de passe" height={24} width={24} />
            )}
          </button>
        )}
      </div>
      <span className="mt-2 text-sm text-red">
        {errorMessage}
      </span>
    </div>
  );
};

export default FormInput;

import type {
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
} from "react-hook-form";

export type InputErrorProps = {
  id: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<FieldValues>>;
};

const FormErrorMessage = ({ id, error }: InputErrorProps) => {
  const message =
    error && "message" in error && typeof error.message === "string"
      ? error.message
      : undefined;

  if (!message) return null;

  return (
    <p
      id={id}
      className="mt-2 text-sm text-error"
      role="alert"
      aria-live="assertive"
    >
      {message}
    </p>
  );
};

export default FormErrorMessage;

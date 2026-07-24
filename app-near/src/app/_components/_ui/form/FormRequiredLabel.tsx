import React from "react";

interface FormRequiredLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

const FormRequiredLabel: React.FC<FormRequiredLabelProps> = ({
  htmlFor,
  children,
}) => (
  <label className="mb-1 block flex-none text-sm font-bold" htmlFor={htmlFor}>
    <span className="text-red" aria-hidden={true}>
      *
    </span>{" "}
    <span className="sr-only">Champ obligatoire</span>
    {children}
  </label>
);

export default FormRequiredLabel;

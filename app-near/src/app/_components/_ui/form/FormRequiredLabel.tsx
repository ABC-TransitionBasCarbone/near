import React from "react";

interface FOrmRequiredLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
}

const FormRequiredLabel: React.FC<FOrmRequiredLabelProps> = ({
  htmlFor,
  children,
}) => (
  <label className="mb-1 block flex-none text-sm font-bold" htmlFor={htmlFor}>
    <span className="text-red" aria-hidden={true}>
      *
    </span>{" "}
    {children}
  </label>
);

export default FormRequiredLabel;

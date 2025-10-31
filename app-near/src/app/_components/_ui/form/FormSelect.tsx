import FormErrorMessage from "./FormErrorMessage";
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";

interface FormSelectProps<FormValues extends FieldValues> {
  name: Path<FormValues>;
  label?: string;
  required?: boolean;
  options: readonly { id: number; value: string }[];
}

const FormSelect = <FormValues extends FieldValues>({
  name,
  label,
  required,
  options,
}: FormSelectProps<FormValues>) => {
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
          <div>
            <select
              id={name}
              className={`hover:ring-indigo-400 focus-within:ring-indigo-400 mt-2 flex w-full items-center rounded-md border border-grayLight bg-white px-4 py-3 text-sm outline-none transition duration-300 focus-within:ring-2 hover:ring-2`}
              value={field.value}
              onChange={(val) => field.onChange(Number(val.target.value))}
            >
              <option value="">Aucune réponse sélectionnée</option>
              {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.value}
                </option>
              ))}
            </select>
            <FormErrorMessage id={`error-${name}`} error={fieldState.error} />
          </div>
        )}
      />
    </div>
  );
};

export default FormSelect;

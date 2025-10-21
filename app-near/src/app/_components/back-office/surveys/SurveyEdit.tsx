"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type SurveyForm,
  surveyForm,
} from "../../../../shared/validations/surveyEdit.validation";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import FormInput from "../../_ui/form/FormInput";
import FormMultiSelectAsync, {
  type SelectOption,
} from "../../_ui/form/FormMultiSelectAsync";
import { type InseeIris2021 } from "@prisma/client";
import Button from "../../_ui/Button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useNotification } from "../../_context/NotificationProvider";
import { NotificationType } from "~/types/enums/notifications";
import { getErrorValue } from "../../_services/error";

const SurveyEdit: React.FC = () => {
  const methods = useForm<SurveyForm>({
    resolver: zodResolver(surveyForm),
    mode: "all",
  });

  const { handleSubmit } = methods;

  const router = useRouter();
  const { setNotification } = useNotification();

  const createSurveyMutation = api.surveys.create.useMutation({
    onSuccess: async () => {
      router.push("/back-office/quartiers");
    },
    onError: async (error) => {
      setNotification({
        type: NotificationType.ERROR,
        value: getErrorValue(error),
      });
    },
  });

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    if (!inputValue) return [];
    try {
      const res = await fetch(`/api/iris/?q=${encodeURIComponent(inputValue)}`);
      const data = (await res.json()) as InseeIris2021[];
      const mapped = data.map((item) => ({
        value: item.iris,
        label: item.iris,
      }));
      return mapped;
    } catch (error) {
      console.error("Erreur fetch options:", error);
      return [];
    }
  };

  const onSubmit: SubmitHandler<SurveyForm> = async (values) => {
    await createSurveyMutation.mutateAsync(values);
  };

  return (
    <div className="m-auto flex max-w-lg justify-center">
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex w-full flex-col gap-3"
        >
          <h1>Nouveau quartier</h1>
          <FormInput
            id="name"
            name="name"
            label="Nom du quartier"
            type="text"
            required
          />
          <FormMultiSelectAsync
            loadOptions={loadOptions}
            name="iris"
            placeholder=" Saisissez vos codes iris..."
            label="Saisissez vos codes iris"
            required
          />

          <Button type="submit" className="mt-6">
            Ajouter
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default SurveyEdit;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import Button from "~/app/_components/_ui/Button";
import FormTextareaWithLabel from "~/app/_components/_ui/form/FormTextareaWithLabel";
import { useNotification } from "~/app/_components/_context/NotificationProvider";
import { useUnsavedChangesWarning } from "~/app/_components/_ui/hooks/useUnsavedChangesWarning";
import {
  type NeighborhoodConfigFormValues,
  neighborhoodConfigSchema,
} from "~/schemas/neighborhood-config";
import { api } from "~/trpc/react";
import { ButtonStyle } from "~/types/enums/button";
import { NotificationType } from "~/types/enums/notifications";

const UNSAVED_CHANGES_STORAGE_KEY = "neighborhood-config-unsaved";

const defaultValues: NeighborhoodConfigFormValues = {
  eastCloseLocations: "",
  eastDistantLocations: "",
  northCloseLocations: "",
  northDistantLocations: "",
  sudCloseLocations: "",
  sudDistantLocations: "",
  westCloseLocations: "",
  westDistantLocations: "",
};

enum Step {
  NORTH = "north",
  SUD = "sud",
  EAST = "east",
  WEST = "west",
}
const stepConfig = {
  [Step.NORTH]: {
    name: Step.NORTH,
    label: "au NORD",
    nextStep: Step.EAST,
    previousStep: Step.NORTH,
  },
  [Step.EAST]: {
    name: Step.EAST,
    label: "à l'EST",
    nextStep: Step.SUD,
    previousStep: Step.NORTH,
  },
  [Step.SUD]: {
    name: Step.SUD,
    label: "au SUD",
    nextStep: Step.WEST,
    previousStep: Step.EAST,
  },
  [Step.WEST]: {
    name: Step.WEST,
    label: "à l'OUEST",
    nextStep: Step.WEST,
    previousStep: Step.SUD,
  },
};

type FormNeighborhoodGeographyProps = {
  onDirtyChange?: (isDirty: boolean) => void;
};

const FormNeighborhoodGeography: React.FC<FormNeighborhoodGeographyProps> = ({
  onDirtyChange,
}) => {
  const [step, setStep] = useState(Step.NORTH);
  const { setNotification } = useNotification();

  const { data: values } = api.neighborhoodsConfigs.getOne.useQuery();
  const neighborhoodConfigMutation =
    api.neighborhoodsConfigs.upsertOne.useMutation();

  const form = useForm<NeighborhoodConfigFormValues>({
    resolver: zodResolver(neighborhoodConfigSchema),
    values: values
      ? {
          northCloseLocations: values.northCloseLocations ?? "",
          northDistantLocations: values.northDistantLocations ?? "",
          sudCloseLocations: values.sudCloseLocations ?? "",
          sudDistantLocations: values.sudDistantLocations ?? "",
          eastCloseLocations: values.eastCloseLocations ?? "",
          eastDistantLocations: values.eastDistantLocations ?? "",
          westCloseLocations: values.westCloseLocations ?? "",
          westDistantLocations: values.westDistantLocations ?? "",
        }
      : defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

  useUnsavedChangesWarning(isDirty, UNSAVED_CHANGES_STORAGE_KEY);

  useEffect(() => {
    onDirtyChange?.(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  const onSubmit: SubmitHandler<NeighborhoodConfigFormValues> = async (
    data,
  ) => {
    try {
      await neighborhoodConfigMutation.mutateAsync(data);
      form.reset(data);
      setStep(stepConfig[step].nextStep);
    } catch {
      setNotification({
        type: NotificationType.ERROR,
        value:
          "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
      });
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-auto flex max-w-2xl flex-col gap-5 pb-8"
      >
        <h1>Définir les destinations phares depuis le quartier</h1>

        <p>
          Ce questionnaire vous accompagne dans la définition des destinations
          phares de votre quartier, c&apos;est-à-dire les lieux et zones vers
          lesquels les habitant·es se déplacent le plus souvent. Ces
          destinations, organisées par direction (nord, sud, est, ouest) et par
          proximité (proche - loin) avec le quartier, seront intégrées
          directement dans le questionnaire Espace et Mode De Vie du quartier de
          votre quartier. Elles permettront de produire des résultats sur
          mesure, ancrés dans la réalité géographique et les habitudes de
          déplacement des habitant·es (travailler, faire les courses ou encore
          pratiquer des loisirs).
        </p>

        <p>
          Dans le questionnaire Espaces et Mode de vie, les répondant·es doivent
          indiquer :
        </p>
        <ul className="list-inside list-disc">
          <li>
            <strong>le mode de transport</strong> utilisé pour mener une
            activité (travail, loisirs, courses)
          </li>
          <li>
            <strong>le temps de trajet</strong> estimé.
          </li>
          <li>
            <strong>la direction</strong> du déplacement (nord, est, sud,
            ouest).
          </li>
        </ul>

        <p>
          Pour que les répondant·es puissent facilement se repérer, il faut
          préparer en amont une <strong>liste des destinations</strong> propre à
          votre quartier.
        </p>

        <p>
          Chaque direction doit être exemplifiée par une liste de destinations,
          comprises dans des zones proches ou loins du quartier.
        </p>

        <p>
          Ici vous allez donc nommer pour chaque direction (Nord, est, sud,
          ouest):
        </p>

        <ul className="list-inside list-disc">
          <li>
            les <strong>destinations proches</strong> à 20 mins à pied du
            quartier, à proximité immédiate (et qui ne sont pas dans le
            quartier).
          </li>
          <li>
            Les <strong>destinations éloignées</strong> : destinations/communes
            connues du plus ou moins proches au delà de 20 minutes à pied (zones
            de proximité, villes voisines, communes en agglomération… ).
          </li>
        </ul>

        <div className="my-4 mt-4 border-t border-dashed" />

        <FormTextareaWithLabel<NeighborhoodConfigFormValues>
          name={`${stepConfig[step].name}CloseLocations`}
          label={
            <div className="text-lg text-blue">
              Quelles sont les{" "}
              <strong>destinations proches {stepConfig[step].label}</strong> du
              quartier, situées à moins de 20 minutes à pied et en dehors du
              quartier ?
            </div>
          }
          hint="Espaces publics, quartiers, communes, lieux-dits ou points de repère.... Citez les lieux du plus proche au plus éloigné."
          maxLength={71}
          rows={3}
        />
        <FormTextareaWithLabel<NeighborhoodConfigFormValues>
          name={`${stepConfig[step].name}DistantLocations`}
          label={
            <div className="text-lg text-blue">
              Quelles sont les{" "}
              <strong>destinations éloignées {stepConfig[step].label}</strong>{" "}
              du quartier, au-delà de 20 minutes à pied ?
            </div>
          }
          hint="Citez les lieux du plus proche au plus éloigné."
          maxLength={71}
          rows={3}
        />
        <div className="flex w-full items-center justify-center gap-3">
          <Button
            style={ButtonStyle.LIGHT}
            color="blue"
            onClick={() => setStep(stepConfig[step].previousStep)}
          >
            Précédent
          </Button>
          <Button style={ButtonStyle.FILLED} color="blue" type="submit">
            {step === Step.WEST ? "Enregistrer" : "Suivant"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormNeighborhoodGeography;

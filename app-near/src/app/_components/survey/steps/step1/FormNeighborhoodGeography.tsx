import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
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
  southCloseLocations: "",
  southDistantLocations: "",
  westCloseLocations: "",
  westDistantLocations: "",
};

enum Step {
  NORTH = "north",
  SOUTH = "south",
  EAST = "east",
  WEST = "west",
}

const stepsOrder = [Step.NORTH, Step.EAST, Step.SOUTH, Step.WEST];

const stepLabel: Record<Step, string> = {
  [Step.NORTH]: "au NORD",
  [Step.EAST]: "à l'EST",
  [Step.SOUTH]: "au SUD",
  [Step.WEST]: "à l'OUEST",
};

const stepShortLabel: Record<Step, string> = {
  [Step.NORTH]: "Nord",
  [Step.EAST]: "Est",
  [Step.SOUTH]: "Sud",
  [Step.WEST]: "Ouest",
};

type FormNeighborhoodGeographyProps = {
  onDirtyChange?: (isDirty: boolean) => void;
};

const FormNeighborhoodGeography: React.FC<FormNeighborhoodGeographyProps> = ({
  onDirtyChange,
}) => {
  const [step, setStep] = useState(Step.NORTH);
  const { setNotification } = useNotification();
  const utils = api.useUtils();

  const { data: values } = api.neighborhoodsConfigs.getOne.useQuery();
  const { data: isCompleted } = api.neighborhoodsConfigs.isCompleted.useQuery();
  const neighborhoodConfigMutation =
    api.neighborhoodsConfigs.upsertOne.useMutation();

  const form = useForm<NeighborhoodConfigFormValues>({
    resolver: zodResolver(neighborhoodConfigSchema),
    values: values
      ? {
          northCloseLocations: values.northCloseLocations ?? "",
          northDistantLocations: values.northDistantLocations ?? "",
          southCloseLocations: values.southCloseLocations ?? "",
          southDistantLocations: values.southDistantLocations ?? "",
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

  const stepIndex = stepsOrder.indexOf(step);
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === stepsOrder.length - 1;

  const goToPreviousStep = () => {
    if (!isFirstStep) setStep(stepsOrder[stepIndex - 1]!);
  };
  const goToNextStep = () => {
    if (!isLastStep) setStep(stepsOrder[stepIndex + 1]!);
  };

  const previousStepButton = (
    <Button
      aria-label="Direction précédente"
      icon={<ArrowForwardOutlinedIcon aria-hidden className="rotate-180" />}
      rounded
      className="shrink-0"
      style={ButtonStyle.LIGHT}
      color="blue"
      disabled={isFirstStep}
      onClick={goToPreviousStep}
    />
  );
  const nextStepButton = (
    <Button
      aria-label="Direction suivante"
      icon={<ArrowForwardOutlinedIcon aria-hidden />}
      rounded
      className="shrink-0"
      style={ButtonStyle.LIGHT}
      color="blue"
      disabled={isLastStep}
      onClick={goToNextStep}
    />
  );

  const onSubmit: SubmitHandler<NeighborhoodConfigFormValues> = async (
    data,
  ) => {
    try {
      await neighborhoodConfigMutation.mutateAsync(data);
      form.reset(data);
      await utils.neighborhoodsConfigs.isCompleted.invalidate();
      goToNextStep();
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
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-4xl font-bold text-blue">
            Définir les destinations phares depuis le quartier
          </h2>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              isCompleted
                ? "bg-success/10 text-success"
                : "bg-error/10 text-error"
            }`}
          >
            {isCompleted ? "✓ Complet" : "● À compléter"}
          </span>
        </div>
        {!isCompleted && (
          <p className="text-sm italic text-gray">
            Tant que ce formulaire n&apos;est pas complété pour les 4
            directions, un rappel s&apos;affichera à l&apos;étape &quot;Enquêtes
            complémentaires&quot;.
          </p>
        )}

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
            les <strong>destinations proches</strong> à 20 minutes à pied du
            quartier, à proximité immédiate (et qui ne sont pas dans le
            quartier).
          </li>
          <li>
            Les <strong>destinations éloignées</strong> : destinations/communes
            connues du plus ou moins proches au delà de 20 minutes à pied (zones
            de proximité, villes voisines, communes en agglomération… ).
          </li>
        </ul>

        <div className="flex items-center gap-2 rounded-lg bg-grayExtraLight p-5 sm:gap-4">
          <div className="hidden sm:block">{previousStepButton}</div>

          <div className="flex min-w-0 flex-1 flex-col gap-5">
            <FormTextareaWithLabel<NeighborhoodConfigFormValues>
              name={`${step}CloseLocations`}
              label={
                <div className="text-lg text-blue">
                  Quelles sont les{" "}
                  <strong>destinations proches {stepLabel[step]}</strong> du
                  quartier, situées à moins de 20 minutes à pied et en dehors du
                  quartier ?
                </div>
              }
              hint="Espaces publics, quartiers, communes, lieux-dits ou points de repère.... Citez les lieux du plus proche au plus éloigné."
              maxLength={71}
              rows={3}
            />
            <FormTextareaWithLabel<NeighborhoodConfigFormValues>
              name={`${step}DistantLocations`}
              label={
                <div className="text-lg text-blue">
                  Quelles sont les{" "}
                  <strong>destinations éloignées {stepLabel[step]}</strong> du
                  quartier, au-delà de 20 minutes à pied ?
                </div>
              }
              hint="Citez les lieux du plus proche au plus éloigné."
              maxLength={71}
              rows={3}
            />
          </div>

          <div className="hidden sm:block">{nextStepButton}</div>
        </div>

        <div className="flex items-center justify-center gap-6 sm:hidden">
          {previousStepButton}
          {nextStepButton}
        </div>

        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-2 pt-2"
        >
          {stepsOrder.map((direction) => (
            <span
              key={direction}
              title={stepShortLabel[direction]}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                direction === step ? "bg-blue" : "bg-grayLight"
              }`}
            />
          ))}
        </div>

        <Button
          style={ButtonStyle.FILLED}
          color="blue"
          type="submit"
          rounded
          className="mt-2 w-full sm:w-auto sm:self-center"
        >
          Enregistrer
        </Button>
      </form>
    </FormProvider>
  );
};

export default FormNeighborhoodGeography;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import Button from "~/app/_components/_ui/Button";
import SavedBadge, {
  type SavedBadgeHandle,
} from "~/app/_components/_ui/SavedBadge";
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
  const savedBadgeRef = useRef<SavedBadgeHandle>(null);
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
      savedBadgeRef.current?.show();
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
            directions, un rappel s&apos;affichera avant de passer à
            l&apos;étape &quot;Enquêtes complémentaires&quot;.
          </p>
        )}

        <p>
          Ce questionnaire vous aide à définir les destinations phares du
          quartier, par direction (nord, sud, est, ouest) et par proximité
          (proche / loin). Elles seront intégrées au questionnaire Espace et
          Mode de Vie pour produire des résultats ancrés dans la réalité
          géographique des habitant·es (travail, courses, loisirs).
        </p>

        <p>Pour chaque direction, indiquez :</p>
        <ul className="list-inside list-disc">
          <li>
            les <strong>destinations proches</strong> : à moins de 20 minutes à
            pied, en dehors du quartier ;
          </li>
          <li>
            les <strong>destinations éloignées</strong> : au-delà de 20 minutes
            à pied (villes voisines, communes de l&apos;agglomération…).
          </li>
        </ul>

        <p className="font-bold">Contraintes de saisie</p>
        <ul className="list-inside list-disc">
          <li>
            Privilégiez des destinations attractives, fréquentées et connues, du
            plus proche au plus éloigné.
          </li>
          <li>Séparez les destinations par des virgules.</li>
          <li>
            Évitez les repères subjectifs ou approximatifs (&ldquo;près
            de&ldquo;, &ldquo;à côté de&ldquo;, &ldquo;après&ldquo;,
            &ldquo;vers&ldquo;).
          </li>
        </ul>

        <p className="font-bold">
          Outil recommandé :{" "}
          <a
            href="https://www.smappen.fr/"
            target="_blank"
            rel="noopener noreferrer"
          >
            smappen.fr
            <span className="sr-only">(ouvre dans un nouvel onglet)</span>
          </a>
        </p>
        <ul className="list-inside list-disc">
          <li>
            Saisissez l&apos;adresse du quartier et définissez une zone à 20
            minutes à pied pour identifier précisément les destinations proches
            et éloignées dans chaque direction.
          </li>
          <li>
            Utile aussi comme support d&apos;animation pour les enquêteur·ices
            sur le terrain.
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
              hint="Espaces publics, quartiers, communes, lieux-dits ou points de repère... Citez les lieux du plus proche au plus éloigné."
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

        <div className="relative mt-2 flex w-full flex-col items-center sm:w-auto sm:self-center">
          <Button
            style={ButtonStyle.FILLED}
            color="blue"
            type="submit"
            rounded
            disabled={neighborhoodConfigMutation.isPending}
            className="w-full sm:w-auto"
          >
            Enregistrer
          </Button>
          <SavedBadge
            ref={savedBadgeRef}
            className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap"
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default FormNeighborhoodGeography;

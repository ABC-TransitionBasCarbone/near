"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { MetabaseIframeType } from "~/types/enums/metabase";
import MetabaseIframe from "../../../_ui/MetabaseIframe";
import { ButtonStyle } from "~/types/enums/button";
import { NotificationType } from "~/types/enums/notifications";
import LinkAsButton from "../../../_ui/LinkAsButton";
import SurveyLayout from "../../SurveyLayout";
import { api } from "~/trpc/react";
import Button from "../../../_ui/Button";
import { useSurveyStateContext } from "../../../_context/surveyStateContext";
import { useNotification } from "../../../_context/NotificationProvider";
import { surveyConfig } from "../config";
import useUpdateSurveyStep from "../../../_ui/hooks/useUpdateSurveyStep";
import { env } from "~/env";
import FormNeighborhoodGeography from "./FormNeighborhoodGeography";

const NeighborhoodInformations: React.FC = () => {
  const { data: session } = useSession();
  const { step } = useSurveyStateContext();
  const { setNotification } = useNotification();
  const [hasUnsavedGeographyChanges, setHasUnsavedGeographyChanges] =
    useState(false);

  const { data: neighborhood } = api.neighborhoods.getOne.useQuery(undefined, {
    enabled: !!session?.user?.survey?.id,
  });

  const updateSurveyStep = useUpdateSurveyStep();

  if (!session?.user.survey || step === undefined) {
    return "loading...";
  }

  const handleStartSurvey = () => {
    if (hasUnsavedGeographyChanges) {
      setNotification({
        type: NotificationType.ERROR,
        value:
          "Veuillez enregistrer les destinations du quartier avant de démarrer l'enquête.",
      });
      return;
    }
    void updateSurveyStep(surveyConfig[step]?.nextStep);
  };

  return (
    <SurveyLayout
      banner={
        <div className="m-auto flex max-w-5xl flex-col gap-5">
          <h1 className="text-3xl text-black">
            Informations sur le quartier :{" "}
            {`${new Intl.NumberFormat("fr-FR").format(
              Number(neighborhood?.population_sum ?? "0"),
            )} `}
            personnes de plus de 15 ans.
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-lg font-bold italic">
              Prêt·e à lancer une grande enquête NEAR dans votre quartier ?
            </p>
            <p>
              Commençons par (re)prendre connaissance de la composition
              sociologique de votre quartier (la zone que vous avez sélectionnée
              lors de votre inscription) : la répartition en âges, sexes et
              catégories socioprofessionnelles d’après les études les plus
              récentes de l’INSEE. Il vous faudra bientôt interroger un
              échantillon avec une répartition similaire pour que votre étude
              soit fiable. La plateforme sera là pour vous aider !
            </p>
          </div>
        </div>
      }
      actions={
        <>
          <LinkAsButton icon="/icons/question.svg" rounded>
            Besoin d&apos;aide
          </LinkAsButton>
          <Button
            icon="/icons/flash.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={handleStartSurvey}
          >
            Démarrer l&apos;enquête
          </Button>
        </>
      }
    >
      <MetabaseIframe
        iframeNumber={env.NEXT_PUBLIC_METABASE_POPULATION_STATISTICS}
        iframeType={MetabaseIframeType.DASHBOARD}
        height="600px"
        params={{ surveyname: session.user.survey.name }}
      />
      <FormNeighborhoodGeography
        onDirtyChange={setHasUnsavedGeographyChanges}
      />
    </SurveyLayout>
  );
};

export default NeighborhoodInformations;

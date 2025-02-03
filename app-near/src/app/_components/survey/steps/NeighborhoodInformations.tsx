"use client";

import { useSession } from "next-auth/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";
import MetabaseIframe from "../../_ui/MetabaseIframe";
import { ButtonStyle } from "~/types/enums/button";
import LinkAsButton from "../../_ui/LinkAsButton";
import SurveyLayout from "../SurveyLayout";
import { api } from "~/trpc/react";
import Button from "../../_ui/Button";
import { useSurveyStateContext } from "../../_context/surveyStateContext";
import { surveyConfig } from "./config";

const NeighborhoodInformations: React.FC = () => {
  const { data: session } = useSession();
  const { step, updateStep } = useSurveyStateContext();

  const { data: neighborhood } = api.neighborhoods.getOne.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
    },
  );

  if (!session) {
    return "loading...";
  }

  return (
    <SurveyLayout
      banner={
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl text-black">
            Informations sur le quartier :{" "}
            {new Intl.NumberFormat("fr-FR").format(
              Number(neighborhood?.population_sum ?? "0"),
            )}
            personnes de plus de 15 ans.
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            sagittis quam ex, iaculis elementum lacus aliquet a. Pellentesque
            eleifend libero quis cursus hendrerit. Praesent at ullamcorper
            ipsum.
          </p>
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
            onClick={() => step && updateStep(surveyConfig[step].nextStep)}
          >
            Démarrer l&apos;enquête
          </Button>
        </>
      }
    >
      <MetabaseIframe
        iframeNumber={MetabaseIFrameNumber.POPULATION_STATISTICS}
        iframeType={MetabaseIframeType.DASHBOARD}
        height="600px"
      />
    </SurveyLayout>
  );
};

export default NeighborhoodInformations;

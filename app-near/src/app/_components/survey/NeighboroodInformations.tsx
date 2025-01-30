"use client";

import { useSession } from "next-auth/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";
import MetabaseIframe from "../_ui/MetabaseIframe";
import { ButtonStyle } from "~/types/enums/button";
import LinkAsButton from "../_ui/LinkAsButton";
import SurveyLayout from "./SurveyLayout";
import { api } from "~/trpc/react";

const NeighboroodInformations: React.FC = () => {
  const { data: session } = useSession();

  const { data: neighborood } = api.neighboroods.getOne.useQuery(
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
        <>
          <h1 className="text-3xl text-black">
            Informations sur le quartier :{" "}
            {neighborood?.population_total ?? "0"} personnes de plus de 15 ans.
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            sagittis quam ex, iaculis elementum lacus aliquet a. Pellentesque
            eleifend libero quis cursus hendrerit. Praesent at ullamcorper
            ipsum.
          </p>
        </>
      }
      actions={
        <>
          <LinkAsButton icon="/icons/question.svg" rounded>
            Besoin d&apos;aide
          </LinkAsButton>
          <LinkAsButton
            icon="/icons/flash.svg"
            rounded
            style={ButtonStyle.FILLED}
          >
            Démarrer l&apos;enquête
          </LinkAsButton>
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

export default NeighboroodInformations;

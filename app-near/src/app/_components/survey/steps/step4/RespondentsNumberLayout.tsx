"use client";

import Link from "next/link";
import SurveyLayout from "../../SurveyLayout";
import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import { useSession } from "next-auth/react";
import { SurveyPhase } from "@prisma/client";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import { MetabaseIframeType } from "~/types/enums/metabase";
import Button from "~/app/_components/_ui/Button";
import { ButtonStyle } from "~/types/enums/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import LinkAsButton from "~/app/_components/_ui/LinkAsButton";
import { surveyConfig } from "../config";
import ConfirmModal from "../ConfirmModal";
import { api } from "~/trpc/react";
import SuDashboard from "../step3/SuDashboard";
import { SurveyType } from "~/types/enums/survey";
import useUpdateSurveyStep from "../../../_ui/hooks/useUpdateSurveyStep";
import { env } from "~/env";

const chartConfig: {
  title: string;
  iframeNumber: number;
  surveyType: SurveyType;
}[] = [
  {
    title: "Espace et Mode de vie",
    iframeNumber: env.NEXT_PUBLIC_METABASE_WAY_OF_LIFE,
    surveyType: SurveyType.WAY_OF_LIFE,
  },
  {
    title: "Empreinte carbone",
    iframeNumber: env.NEXT_PUBLIC_METABASE_CARBON_FOOTPRINT,
    surveyType: SurveyType.CARBON_FOOTPRINT,
  },
];

interface RespondentsNumberLayoutProps {
  setToggleBroadcastingPage: Dispatch<SetStateAction<boolean>>;
  setSurveyType: Dispatch<SetStateAction<SurveyType | undefined>>;
}
const RespondentsNumberLayout: React.FC<RespondentsNumberLayoutProps> = ({
  setToggleBroadcastingPage,
  setSurveyType,
}) => {
  const { step, updateStep } = useSurveyStateContext();
  const { data: session } = useSession();
  const updateSurveyStep = useUpdateSurveyStep();

  const { data: wayOfLifeAnswersCount } = api.wayOfLifeAnswers.count.useQuery(
    undefined,
    {
      enabled: !!session?.user?.survey?.id,
    },
  );
  const { data: carbonFootprintAnswersCount } =
    api.carbonFootprintAnswers.count.useQuery(undefined, {
      enabled: !!session?.user?.survey?.id,
    });

  const [showModal, setShowModal] = useState<boolean>(false);

  const nextStepIsDisabled =
    wayOfLifeAnswersCount! < 80 && carbonFootprintAnswersCount! < 80;

  if (
    !session?.user.survey?.id ||
    !session?.user.survey?.name ||
    step === undefined
  ) {
    return "loading...";
  }

  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => updateStep(SurveyPhase.STEP_3_SU_EXPLORATION)}
              href="/"
            >
              &lt; Retour
            </Link>
          </div>

          <h1 className="my-4 text-3xl text-black">
            Phase d&apos;enquête n°2 : nombre de répondants
          </h1>
          <p>Où en êtes-vous du nombre de personnes à interroger ?</p>
          <div className="mt-8 flex justify-center"></div>
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
            onClick={() => setShowModal(true)}
          >
            Forcer la visualisation
          </Button>
          <Button
            icon="/icons/flash.svg"
            rounded
            disabled={nextStepIsDisabled}
            style={ButtonStyle.FILLED}
            onClick={() => updateSurveyStep(surveyConfig[step].nextStep)}
          >
            Visualiser les résultats
          </Button>
        </>
      }
    >
      <>
        <ConfirmModal
          nextStep={surveyConfig[step].nextStep}
          showModal={showModal}
          setShowModal={setShowModal}
          text="Vous êtes sur le point de finaliser des enquêtes qui n’ont pas atteint
            leurs objectifs en quantité de réponses attendues. Il est probable que
            vos enquêtes ne donnent pas de résultats fidèles à la diversité de la
            population."
        />
        <div className="mx-6 my-8 flex flex-col gap-16">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-16">
            {chartConfig.map((chart) => (
              <div
                key={chart.iframeNumber}
                className="flex w-full flex-col items-center gap-y-8 sm:w-[600px]"
              >
                <div className="w-full">
                  <div className="mb-1 text-center text-3xl">{chart.title}</div>
                  <MetabaseIframe
                    iframeNumber={chart.iframeNumber}
                    iframeType={MetabaseIframeType.QUESTION}
                    height="300px"
                    params={{ surveyName: session.user.survey!.name }}
                  />
                </div>
                <Button
                  icon="/icons/rocket.svg"
                  rounded
                  style={ButtonStyle.LIGHT}
                  onClick={() => {
                    setToggleBroadcastingPage(true);
                    setSurveyType(chart.surveyType);
                  }}
                >
                  Diffuser le questionnaire
                </Button>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-10">
            <div className="text-xl">Rappel des Sphères d&apos;Usages</div>
            <SuDashboard phase={SurveyPhase.STEP_4_ADDITIONAL_SURVEY} />
          </div>
        </div>
      </>
    </SurveyLayout>
  );
};

export default RespondentsNumberLayout;

"use client";

import Link from "next/link";
import SurveyLayout from "../../SurveyLayout";
import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import { useSession } from "next-auth/react";
import { SurveyPhase } from "@prisma/client";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";
import Button from "~/app/_components/_ui/Button";
import { ButtonStyle } from "~/types/enums/button";
import { useState, type Dispatch, type SetStateAction } from "react";
import { SurveyType } from "~/types/enums/broadcasting";
import LinkAsButton from "~/app/_components/_ui/LinkAsButton";
import RepresentativenessConfirmModal from "../step2/representativeness/RepresentativenessConfirmModal";
import { surveyConfig } from "../config";
import useUpdateSurveyStep from "../../hooks/useUpdateSurveyStep";

const chartConfig: {
  title: string;
  iframeNumber: MetabaseIFrameNumber;
  surveyType: SurveyType;
}[] = [
  {
    title: "Mode de vie",
    iframeNumber: MetabaseIFrameNumber.WAY_OF_LIFE,
    surveyType: SurveyType.WAY_OF_LIFE,
  },
  {
    title: "Empreinte carbone",
    iframeNumber: MetabaseIFrameNumber.CARBON_FOOTPRINT,
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

  const [showModal, setShowModal] = useState<boolean>(false);

  const nextStepIsDisabled = true;

  if (!session?.user.surveyId || step === undefined) {
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
            Forcer la fin de l&apos;enquête
          </Button>
          <Button
            icon="/icons/flash.svg"
            rounded
            disabled={nextStepIsDisabled}
            style={ButtonStyle.FILLED}
            onClick={() => updateSurveyStep(surveyConfig[step].nextStep)}
          >
            Continuer l&apos;enquête
          </Button>
        </>
      }
    >
      <>
        <RepresentativenessConfirmModal
          nextStep={surveyConfig[step].nextStep}
          showModal={showModal}
          setShowModal={setShowModal}
        />
        <div className="my-8 flex flex-col gap-16">
          <div className="flex flex-wrap gap-4">
            {chartConfig.map((chart) => (
              <div
                key={chart.iframeNumber}
                className="flex flex-1 flex-col items-center gap-3"
              >
                <div className="text-xl">{chart.title}</div>
                <MetabaseIframe
                  iframeNumber={chart.iframeNumber}
                  iframeType={MetabaseIframeType.QUESTION}
                  height="300px"
                />
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
            <div className="text-xl">Rappel des Sphères d&apos;Usage</div>
            <div className="h-32">Pending NEAR-31...</div>
          </div>
        </div>
      </>
    </SurveyLayout>
  );
};

export default RespondentsNumberLayout;

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
import { type Dispatch, type SetStateAction } from "react";
import { SurveyType } from "~/types/enums/broadcasting";
import LinkAsButton from "~/app/_components/_ui/LinkAsButton";
import { surveyConfig } from "../config";
import useUpdateSurveyStep from "../../hooks/useUpdateSurveyStep";

const chartConfig: {
  title: string;
  iframeNumber: MetabaseIFrameNumber;
  surveyType: SurveyType;
}[] = [
  {
    title: "Espace et Mode de vie",
    iframeNumber: MetabaseIFrameNumber.WAY_OF_LIFE,
    surveyType: SurveyType.WAY_OF_LIFE,
  },
  {
    title: "Empreinte carbone (Nos Gestes Climats)",
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

  // NEAR-34: const [showModal, setShowModal] = useState<boolean>(false);

  // NEAR-34: to change if sample target is confirmed
  const nextStepIsDisabled = false;

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
          {/* NEAR-34: To restore if sample target is confirmed */}
          {/* <Button
            icon="/icons/flash.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={() => setShowModal(true)}
          >
            Forcer la fin de l&apos;enquête
          </Button> */}
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
        {/* NEAR-34: To restore if sample target is confirmed */}
        {/* <RepresentativenessConfirmModal
          nextStep={surveyConfig[step].nextStep}
          showModal={showModal}
          setShowModal={setShowModal}
        /> */}
        <div className="mx-6 my-8 flex flex-col gap-16">
          <div className="flex flex-wrap gap-x-4 gap-y-16">
            {chartConfig.map((chart) => (
              <div
                key={chart.iframeNumber}
                className="flex min-w-96 flex-1 flex-col items-center gap-y-8"
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
            {/* NEAR-34: to update when near-31 finished */}
            <div className="h-32">Pending NEAR-31...</div>
          </div>
        </div>
      </>
    </SurveyLayout>
  );
};

export default RespondentsNumberLayout;

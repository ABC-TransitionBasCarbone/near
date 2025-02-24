"use client";

import Link from "next/link";
import { useState, type Dispatch, type SetStateAction } from "react";
import { ButtonStyle } from "~/types/enums/button";
import { env } from "../../../../../../env";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../../../types/enums/metabase";
import { useSurveyStateContext } from "../../../../_context/surveyStateContext";
import Button from "../../../../_ui/Button";
import LinkAsButton from "../../../../_ui/LinkAsButton";
import MetabaseIframe from "../../../../_ui/MetabaseIframe";
import { renderIcon } from "../../../../_ui/utils/renderIcon";
import SurveyLayout from "../../../SurveyLayout";
import { surveyConfig } from "../../config";
import RepresentativenessPage from "./RepresentativenessPage";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import {
  getBelowThresholdValues,
  THRESHOLD_VALUE,
} from "~/shared/services/su-surveys/threshold";
import useUpdateSurveyStep from "../../../hooks/useUpdateSurveyStep";
import RepresentativenessConfirmModal from "./RepresentativenessConfirmModal";

interface RepresentativenessLayoutProps {
  setToggleBroadcastingPage: Dispatch<SetStateAction<boolean>>;
}

const RepresentativenessLayout: React.FC<RepresentativenessLayoutProps> = ({
  setToggleBroadcastingPage,
}) => {
  const { data: session } = useSession();
  const { step } = useSurveyStateContext();
  const { data: categoryStats } = api.answers.representativeness.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
    },
  );
  const { data: count } = api.answers.count.useQuery(
    session?.user?.surveyId ?? 0,
    {
      enabled: !!session?.user?.surveyId,
    },
  );
  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  const [showModal, setShowModal] = useState<boolean>(false);

  const updateSurveyStep = useUpdateSurveyStep();

  const nextStepIsDisabled =
    !categoryStats ||
    !count ||
    !survey?.sampleTarget ||
    count < survey.sampleTarget ||
    Object.values(getBelowThresholdValues(categoryStats, THRESHOLD_VALUE))
      .length !== 0;

  if (!survey || step === undefined || !categoryStats) {
    return "Loading...";
  }

  return (
    <>
      <RepresentativenessConfirmModal
        nextStep={surveyConfig[step].nextStep}
        showModal={showModal}
        setShowModal={setShowModal}
      />
      <SurveyLayout
        banner={
          <>
            <div className="flex flex-row flex-wrap items-stretch justify-center gap-10">
              <div className="order-2 sm:order-1">
                <MetabaseIframe
                  iframeNumber={MetabaseIFrameNumber.JAUGE_ERROR_MARGIN}
                  iframeType={MetabaseIframeType.QUESTION}
                  height="300px"
                  width="300px"
                />
              </div>

              <div className="order-1 flex max-w-lg flex-col justify-center sm:order-2">
                <Link
                  className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
                  onClick={() =>
                    updateSurveyStep(surveyConfig[step].previouxStep)
                  }
                  href="/"
                >
                  &lt;&nbsp;Retour
                </Link>

                <h1 className="my-4 text-3xl text-black">
                  Nombre et représentativité des répondants au questionnaire
                </h1>
                <p>
                  Essayer de faire dépasser le seuil pour chaque indicateur pour
                  avoir une enquête représentative de la population.
                </p>
              </div>

              <div className="order-3 flex w-full flex-col justify-center gap-10 sm:w-auto">
                <Button
                  icon="/icons/rocket.svg"
                  rounded
                  style={ButtonStyle.LIGHT}
                  onClick={() => {
                    setToggleBroadcastingPage(true);
                  }}
                >
                  Diffuser le questionnaire
                </Button>
                <LinkAsButton
                  href={`${env.NEXT_PUBLIC_TYPEFORM_SU_STATS}`}
                  icon="/icons/megaphone.svg"
                  openNewTab
                  rounded
                >
                  Suivre la diffusion {renderIcon("/icons/external-link.svg")}
                </LinkAsButton>
              </div>
            </div>
          </>
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
        <RepresentativenessPage categoryStats={categoryStats} survey={survey} />
      </SurveyLayout>
    </>
  );
};

export default RepresentativenessLayout;

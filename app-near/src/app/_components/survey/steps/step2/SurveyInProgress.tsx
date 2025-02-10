"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import { env } from "../../../../../env";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../../types/enums/metabase";
import { useSurveyStateContext } from "../../../_context/surveyStateContext";
import Button from "../../../_ui/Button";
import LinkAsButton from "../../../_ui/LinkAsButton";
import MetabaseIframe from "../../../_ui/MetabaseIframe";
import { renderIcon } from "../../../_ui/utils/renderIcon";
import SurveyLayout from "../../SurveyLayout";
import { surveyConfig } from "../config";
import { type Dispatch, type SetStateAction } from "react";
import SampleRadios from "./SampleRadios";

interface SurveyInProgressProps {
  setToggleBroadcastingPage: Dispatch<SetStateAction<boolean>>;
}

const SurveyInProgress: React.FC<SurveyInProgressProps> = ({
  setToggleBroadcastingPage,
}) => {
  const { step, updateStep } = useSurveyStateContext();

  return (
    <SurveyLayout
      banner={
        <>
          <div className="flex flex-row flex-wrap items-stretch justify-center gap-10">
            <MetabaseIframe
              iframeNumber={MetabaseIFrameNumber.JAUGE_ERROR_MARGIN}
              iframeType={MetabaseIframeType.QUESTION}
              height="300px"
              width="300px"
            />

            <div className="flex max-w-lg flex-col justify-center">
              <Link
                className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
                onClick={() =>
                  step && updateStep(surveyConfig[step].previouxStep)
                }
                href="/"
              >
                &lt;&nbsp;Retour
              </Link>

              <h1 className="my-4 text-3xl text-black">
                Nombre et représentativité des répondants au questionnaire
              </h1>
              <p>
                Essayer de faire dépasser le seul pour chaque indicateur pour
                avoir une enquête représentative de la population.
              </p>
            </div>

            <div className="flex w-full flex-col justify-center gap-10 sm:w-auto">
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
            disabled
            style={ButtonStyle.FILLED}
            onClick={() => step && updateStep(surveyConfig[step].nextStep)}
          >
            Forcer la fin de l&apos;enquête
          </Button>
          <Button
            icon="/icons/flash.svg"
            rounded
            disabled
            style={ButtonStyle.FILLED}
            onClick={() => step && updateStep(surveyConfig[step].nextStep)}
          >
            Continuer l&apos;enquête
          </Button>
        </>
      }
    >
      <div>
        <SampleRadios />
      </div>
    </SurveyLayout>
  );
};

export default SurveyInProgress;

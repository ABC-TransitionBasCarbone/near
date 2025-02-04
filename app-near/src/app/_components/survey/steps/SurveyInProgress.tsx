"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "../../../../types/enums/metabase";
import { useSurveyStateContext } from "../../_context/surveyStateContext";
import Button from "../../_ui/Button";
import LinkAsButton from "../../_ui/LinkAsButton";
import MetabaseIframe from "../../_ui/MetabaseIframe";
import SurveyLayout from "../SurveyLayout";
import { env } from "../../../../env";
import { surveyConfig } from "./config";
import { renderIcon } from "../../_ui/utils/renderIcon";

const SurveyInProgress: React.FC = () => {
  const { step, updateStep } = useSurveyStateContext();

  return (
    <SurveyLayout
      banner={
        <>
          <div className="flex flex-row flex-wrap justify-center gap-10">
            <MetabaseIframe
              iframeNumber={MetabaseIFrameNumber.JAUGE_ERROR_MARGIN}
              iframeType={MetabaseIframeType.QUESTION}
              height="300px"
              width="300px"
            />

            <div className="flex max-w-lg flex-col">
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

            <div className="flex flex-col justify-center gap-10">
              <Button
                icon="/icons/rocket.svg"
                rounded
                style={ButtonStyle.LIGHT}
                onClick={() => {
                  console.debug("TODO");
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
      <div></div>
    </SurveyLayout>
  );
};

export default SurveyInProgress;

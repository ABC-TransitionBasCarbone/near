"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import { useSurveyStateContext } from "../../_context/surveyStateContext";
import Button from "../../_ui/Button";
import LinkAsButton from "../../_ui/LinkAsButton";
import BroadcastingPage from "../../BroadcastingPage";
import SurveyLayout from "../SurveyLayout";
import { surveyConfig } from "./config";
import { env } from "../../../../env";
import { renderIcon } from "../../_ui/utils/renderIcon";

const Broadcasting: React.FC = () => {
  const { step, updateStep } = useSurveyStateContext();

  return (
    <SurveyLayout
      banner={
        <>
          <div className="my-4">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() =>
                step && updateStep(surveyConfig[step].previouxStep)
              }
              href="/"
            >
              &lt; Retour
            </Link>
          </div>

          <h1 className="my-4 text-3xl text-black">
            Diffusion du questionnaire Sphère d&apos;usage
          </h1>
          <p>
            Choississez un ou plusieurs modes de diffusion pour votre
            questionnaire.
          </p>
        </>
      }
      actions={
        <>
          <LinkAsButton icon="/icons/question.svg" rounded>
            Besoin d&apos;aide
          </LinkAsButton>
          <LinkAsButton
            href={`${env.NEXT_PUBLIC_TYPEFORM_SU_STATS}`}
            icon="/icons/megaphone.svg"
            openNewTab
            rounded
          >
            Suivre la diffusion {renderIcon("/icons/external-link.svg")}
          </LinkAsButton>
          <Button
            icon="/icons/flash.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={() => step && updateStep(surveyConfig[step].nextStep)}
          >
            Continuer l&apos;enquête
          </Button>
        </>
      }
    >
      <BroadcastingPage surveyType={"su"} />
    </SurveyLayout>
  );
};

export default Broadcasting;

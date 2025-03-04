"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import Button from "../../_ui/Button";
import LinkAsButton from "../../_ui/LinkAsButton";
import BroadcastingPage from "./BroadcastingPage";
import SurveyLayout from "../SurveyLayout";
import { renderIcon } from "../../_ui/utils/renderIcon";
import { type Dispatch, type SetStateAction } from "react";
import { type SurveyType, surveyTypeMapper } from "~/types/enums/broadcasting";

interface BroadcastingLayoutProps {
  setToggleBroadcastingPage: Dispatch<SetStateAction<boolean>>;
  surveyType: SurveyType;
}

const BroadcastingLayout: React.FC<BroadcastingLayoutProps> = ({
  setToggleBroadcastingPage,
  surveyType,
}) => {
  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => setToggleBroadcastingPage(false)}
              href=""
            >
              &lt; Retour
            </Link>
          </div>

          <h1 className="my-4 text-3xl text-black">
            Diffusion du questionnaire {surveyTypeMapper[surveyType].label}
          </h1>
          <p>
            Choississez un ou plusieurs modes de diffusion pour votre
            questionnaire.
          </p>
        </div>
      }
      actions={
        <>
          <LinkAsButton icon="/icons/question.svg" rounded>
            Besoin d&apos;aide
          </LinkAsButton>
          {surveyTypeMapper[surveyType].stat && (
            <LinkAsButton
              href={surveyTypeMapper[surveyType].stat}
              icon="/icons/megaphone.svg"
              openNewTab
              rounded
            >
              Suivre la diffusion {renderIcon("/icons/external-link.svg")}
            </LinkAsButton>
          )}
          <Button
            icon="/icons/flash.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={() => setToggleBroadcastingPage(false)}
          >
            Continuer l&apos;enquête
          </Button>
        </>
      }
    >
      <BroadcastingPage surveyType={surveyType} />
    </SurveyLayout>
  );
};

export default BroadcastingLayout;

"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import Button from "../../../_ui/Button";
import SurveyLayout from "../../SurveyLayout";
import { api } from "~/trpc/react";

const DetectionLayout: React.FC = () => {
  const suDetectionMutation = api.suDetection.run.useMutation();

  const launchSuDetection = async () => {
    await suDetectionMutation.mutateAsync();
  };

  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => {
                (""); // TODO
              }}
              href="" // TODO
            >
              &lt; Retour
            </Link>
          </div>

          <h1 className="my-4 text-3xl text-black">
            Détection des sphères d&apos;usage
          </h1>
          <p>
            Lancez <b>l’algorithme de détection des Sphères d’Usages</b>. Si le
            résultat ne vous convient pas, vous pouvez relancer la détection.
          </p>
          <Button
            icon="/icons/arrow-right.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={launchSuDetection}
          >
            Détecter les sphères d&apos;usage
          </Button>
        </div>
      }
      actions={<></>}
    >
      <></> {/* TODO NEAR-31 */}
    </SurveyLayout>
  );
};

export default DetectionLayout;

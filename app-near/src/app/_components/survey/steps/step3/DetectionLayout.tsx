"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import Button from "../../../_ui/Button";
import SurveyLayout from "../../SurveyLayout";
import { api } from "~/trpc/react";
import SuDashboard from "./SuDashboard";
import useUpdateSurveyStep from "../../hooks/useUpdateSurveyStep";
import { surveyConfig } from "../config";
import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import { useSession } from "next-auth/react";
import { useNotification } from "~/app/_components/_context/NotificationProvider";
import { NotificationType } from "~/types/enums/notifications";
import { SurveyPhase } from "@prisma/client";
import { getErrorValue } from "~/app/_components/_services/error";
import { useState } from "react";

const DetectionLayout: React.FC = () => {
  const { step } = useSurveyStateContext();
  const updateSurveyStep = useUpdateSurveyStep();
  const { data: session } = useSession();
  const { setNotification } = useNotification();
  const utils = api.useUtils();

  const [suNumberList, setSuNumberList] = useState<number[]>([]);

  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  const suDetectionMutation = api.suDetection.run.useMutation({
    onSuccess: async () => {
      await utils.surveys.getOne.invalidate();
    },
    onError: (e) =>
      setNotification({
        type: NotificationType.ERROR,
        value: getErrorValue(e),
      }),
  });

  const sendSuEmailMutation = api.answers.sendSu.useMutation({
    onSuccess: () => step && updateSurveyStep(surveyConfig[step]?.nextStep),
    onError: (e) =>
      setNotification({
        type: NotificationType.ERROR,
        value: getErrorValue(e),
      }),
  });

  const launchSuDetection = async () => {
    try {
      const response = await suDetectionMutation.mutateAsync();
      setSuNumberList(response);
    } catch (error) {
      console.error("Error while detecting su:", error);
    }
  };

  if (!session?.user.surveyId || step === undefined) {
    return "Loading...";
  }

  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => {
                updateSurveyStep(surveyConfig[step].previouxStep).catch(
                  (error) => console.error(error),
                );
              }}
              href=""
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
          <div className="mt-8 flex justify-center">
            <Button
              icon="/icons/arrow-right.svg"
              rounded
              style={ButtonStyle.FILLED}
              onClick={launchSuDetection}
              disabled={
                survey?.phase !== SurveyPhase.STEP_3_SU_EXPLORATION ||
                suDetectionMutation.isPending
              }
            >
              {suDetectionMutation.isPending
                ? "Chargement..."
                : "Détecter les sphères d'usage"}
            </Button>
          </div>
        </div>
      }
      actions={
        <>
          <Button
            icon="/icons/arrow-right.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={() => sendSuEmailMutation.mutate(session?.user.surveyId)}
            disabled={
              sendSuEmailMutation.isPending ||
              !survey?.computedSu ||
              survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION
            }
          >
            {sendSuEmailMutation.isPending
              ? "...chargement"
              : "Continuer l'enquête"}
          </Button>
        </>
      }
    >
      <SuDashboard suNumberList={suNumberList} />
    </SurveyLayout>
  );
};

export default DetectionLayout;

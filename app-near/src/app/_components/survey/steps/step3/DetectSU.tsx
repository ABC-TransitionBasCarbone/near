"use client";

import Link from "next/link";
import { ButtonStyle } from "~/types/enums/button";
import Button from "../../../_ui/Button";
import SurveyLayout from "../../SurveyLayout";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";

export const generateSuData = (surveyId: number) => {
  // TODO: À modifier par Sandrine
  return [
    { su: 1, barycenter: [0.5, 1.5], popPercentage: 25.5 },
    { su: 1, barycenter: [0.9, 1.9], popPercentage: 25.9 },
  ];
};

export const getSuNames = async (surveyId: number) => {
  try {
    const computedSus = generateSuData(surveyId);

    const detectSuMutation = api.suData.detectSu.useMutation();

    const response = await detectSuMutation.mutateAsync({
      surveyId,
      computedSus,
    });

    return response;
  } catch (error) {
    console.error("Error while saving SU:", error);
    throw error;
  }
};

const launchSuDetection = async (surveyId: number) => {
  try {
    const suNames = await getSuNames(surveyId);

    console.log("SU saved:", suNames);
  } catch (error) {
    console.error("Error during SU detection:", error);
  }
};

const DetectSU: React.FC = () => {
  const { data: session } = useSession();
  const surveyId = session?.user?.surveyId;

  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => {
                ("");
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
          <Button
            icon="/icons/arrow-right.svg"
            rounded
            style={ButtonStyle.FILLED}
            onClick={async () => {
              if (surveyId) {
                await launchSuDetection(surveyId);
              } else {
                console.error("Survey ID is undefined");
              }
            }}
            disabled={!surveyId}
          >
            Détecter les sphères d&apos;usage
          </Button>
        </div>
      }
      actions={<></>}
    >
      <span>children</span>
    </SurveyLayout>
  );
};

export default DetectSU;

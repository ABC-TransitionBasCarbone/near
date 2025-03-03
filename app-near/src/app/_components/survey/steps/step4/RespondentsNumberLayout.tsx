"use client";

import Link from "next/link";
import SurveyLayout from "../../SurveyLayout";
import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import { useSession } from "next-auth/react";

const RespondentsNumberLayout: React.FC = () => {
  const { step } = useSurveyStateContext();
  const { data: session } = useSession();

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
              onClick={() => {
                (""); // TODO
              }}
              href="" // TODO
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
      actions={<></>}
    >
      <></>
    </SurveyLayout>
  );
};

export default RespondentsNumberLayout;

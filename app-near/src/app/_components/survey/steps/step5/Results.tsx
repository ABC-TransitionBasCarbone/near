import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import SurveyLayout from "../../SurveyLayout";
import { surveyConfig } from "../config";
import Link from "next/link";
import DatavizDashboard from "~/app/_components/dataviz/DatavizDashboard";

const Results: React.FC = () => {
  const { step, updateStep } = useSurveyStateContext();

  if (step === undefined) {
    return "loading...";
  }

  return (
    <SurveyLayout
      banner={
        <div className="m-auto max-w-5xl">
          <div className="my-4 flex">
            <Link
              className="items-center gap-3 py-2 font-sans font-bold text-blue no-underline hover:ring-0"
              onClick={() => updateStep(surveyConfig[step].previouxStep)}
              href="/"
            >
              &lt; Retour
            </Link>
          </div>

          <h1 className="my-4 text-3xl text-black">Résultat des enquêtes</h1>
        </div>
      }
    >
      <div className="mx-auto mb-10 mt-8 max-w-5xl">
        <DatavizDashboard />
      </div>
    </SurveyLayout>
  );
};

export default Results;

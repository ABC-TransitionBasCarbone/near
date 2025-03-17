import { useSurveyStateContext } from "~/app/_components/_context/surveyStateContext";
import SurveyLayout from "../../SurveyLayout";
import { surveyConfig } from "../config";
import Link from "next/link";
import Button from "~/app/_components/_ui/Button";
import { Component, useState } from "react";
import {
  allResultDashboards,
  ResultDashboard,
} from "~/types/enums/resultDashboard";
import { ButtonStyle } from "~/types/enums/button";
import StatQuality from "./StatQuality";

const dahboardMapping: Record<
  ResultDashboard,
  { label: string; component: JSX.Element }
> = {
  [ResultDashboard.CARBON_FOOTPRINT]: {
    label: "Empreinte carbone et répartition par secteur",
    component: <>TODO carbon footprint</>,
  },
  [ResultDashboard.DESIRE_FOR_CHANGE]: {
    label: "Volontés de changement d'usages",
    component: <>TODO desire for change</>,
  },
  [ResultDashboard.FEEDBACK]: {
    label: "Avis sur le quartier et le cadre de vie",
    component: <>TODO feedback</>,
  },
  [ResultDashboard.LIVING_SPACE]: {
    label: "Espaces de vie et modes de déplacement",
    component: <>TODO space</>,
  },
  [ResultDashboard.POPULATION]: {
    label: "Population représentée et usages quotidiens",
    component: <>TODO population</>,
  },
  [ResultDashboard.QUALITY_STAT]: {
    label: "Qualité statistique",
    component: <StatQuality />,
  },
};

const Results: React.FC = () => {
  const { step, updateStep } = useSurveyStateContext();
  const [resultDashboard, setResultDashboard] = useState<ResultDashboard>(
    ResultDashboard.QUALITY_STAT,
  );

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
          <div className="mt-8 flex flex-wrap gap-2">
            {allResultDashboards.map((item) => (
              <Button
                key={item}
                rounded
                onClick={() => setResultDashboard(item)}
                style={
                  item === resultDashboard
                    ? ButtonStyle.FILLED
                    : ButtonStyle.LIGHT
                }
              >
                {dahboardMapping[item].label}
              </Button>
            ))}
          </div>
        </div>
      }
    >
      <div className="m-auto mt-8 max-w-5xl">
        {dahboardMapping[resultDashboard].component}
      </div>
    </SurveyLayout>
  );
};

export default Results;

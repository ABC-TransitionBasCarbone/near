import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";

interface SuDashboardProps {
  suNumberList: number[];
}

const SuDashboard: React.FC<SuDashboardProps> = ({ suNumberList }) => {
  const { data: session } = useSession();
  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  if (!survey?.computedSu || !suNumberList || suNumberList.length === 0) {
    return;
  }

  return (
    <div className="mx-20 p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">% de la population</h2>
        <MetabaseIframe
          iframeNumber={MetabaseIFrameNumber.POPULATION_PERCENTAGE}
          iframeType={MetabaseIframeType.QUESTION}
          width="100%"
          height="250px"
        />
      </div>

      <div className="flex flex-row justify-center">
        <div key={0} className="">
          <h2 className="text-lg font-semibold">Quartier</h2>
          <MetabaseIframe
            iframeNumber={MetabaseIFrameNumber.SU}
            iframeType={MetabaseIframeType.DASHBOARD}
            width="450px"
            height="3450px"
            params={{ su: 0, surveyname: survey?.name }}
          />
        </div>
        <div className="flex overflow-y-auto">
          {suNumberList.map((suNumber) => (
            <div key={suNumber} className="flex flex-col">
              <h2 className="text-lg font-semibold">Su n°{suNumber}</h2>
              <MetabaseIframe
                iframeNumber={MetabaseIFrameNumber.SU}
                iframeType={MetabaseIframeType.DASHBOARD}
                width="450px"
                height="3450px"
                params={{ su: suNumber, surveyname: survey?.name }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuDashboard;

import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";

const SuDashboard: React.FC = () => {
  const { data: session } = useSession();
  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  //@ts-expect-error enabled when survey.id is not null
  const { data: suIdList } = api.suDetection.getList.useQuery(survey.id, {
    enabled: !!survey?.id,
  });

  if (!survey?.computedSu || !suIdList || suIdList.length === 0) {
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
          {suIdList.map((suId) => (
            <div key={suId} className="flex flex-col">
              <h2 className="text-lg font-semibold">Su n°{suId}</h2>
              <MetabaseIframe
                iframeNumber={MetabaseIFrameNumber.SU}
                iframeType={MetabaseIframeType.DASHBOARD}
                width="450px"
                height="3450px"
                params={{ su: suId, surveyname: survey?.name }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuDashboard;

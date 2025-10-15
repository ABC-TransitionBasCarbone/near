import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import { MetabaseIframeType } from "~/types/enums/metabase";
import { env } from "~/env";
import { useRef } from "react";
import { type SurveyPhase } from "@prisma/client";
import { type StoredComputedSu } from "../../../../../server/su/computeSu";

interface SuDashboardProps {
  phase: SurveyPhase;
}
const SuDashboard: React.FC<SuDashboardProps> = ({ phase }) => {
  const { data: session } = useSession();

  const scrollRef = useRef(null);
  const topScrollRef = useRef(null);

  // @ts-expect-error target type
  const handleScroll = (e, target) => {
    if (target.current) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      target.current.scrollLeft = e.target.scrollLeft;
    }
  };

  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.survey?.id,
  });

  const { data: computedSuList } = api.suDetection.getList.useQuery(undefined, {
    enabled: !!survey?.id,
  });

  if (!survey?.computedSu || !computedSuList || computedSuList.length === 0) {
    return;
  }

  return (
    <div className="mx-20 max-w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">% de la population</h2>
        <MetabaseIframe
          iframeNumber={env.NEXT_PUBLIC_METABASE_POPULATION_PERCENTAGE}
          iframeType={MetabaseIframeType.QUESTION}
          width="100%"
          height="250px"
        />
      </div>

      <div className="flex flex-row gap-4">
        <div key={0} className="w-[450px]">
          <h2 className="text-lg font-semibold">Quartier</h2>
          <MetabaseIframe
            iframeNumber={env.NEXT_PUBLIC_METABASE_SU}
            iframeType={MetabaseIframeType.DASHBOARD}
            width="450px"
            height="3450px"
            params={{ su: 0, surveyname: survey?.name }}
          />
        </div>
        <div className="w-1 border-l-2 border-gray"></div>
        <div className="relative min-w-0 flex-grow">
          <div
            className="flex min-w-0 overflow-x-hidden"
            ref={scrollRef}
            onScroll={(e) => handleScroll(e, topScrollRef)}
          >
            {computedSuList.map((su: StoredComputedSu) => (
              <div key={su.id} className="flex flex-col">
                <h2 className="text-lg font-semibold">Su n°{su.su}</h2>
                <MetabaseIframe
                  iframeNumber={env.NEXT_PUBLIC_METABASE_SU}
                  iframeType={MetabaseIframeType.DASHBOARD}
                  width="450px"
                  height="3450px"
                  params={{ su: su.id, surveyname: survey?.name }}
                />
              </div>
            ))}
          </div>

          <div
            ref={topScrollRef}
            className={`sticky ${survey.phase === phase ? "bottom-[110px]" : "bottom-0"} left-0 w-full overflow-x-auto`}
            onScroll={(e) => handleScroll(e, scrollRef)}
          >
            <div className="h-2 w-[4000px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuDashboard;

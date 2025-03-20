import { useSession } from "next-auth/react";
import MetabaseIframe from "~/app/_components/_ui/MetabaseIframe";
import { api } from "~/trpc/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";

const StatQuality: React.FC = () => {
  const { data: session } = useSession();
  const { data: qualityStatisticsWithPopulation } =
    api.analyzes.quality.useQuery(undefined, {
      enabled: !!session?.user.surveyName,
    });

  return (
    <div className="flex flex-col flex-wrap gap-5 md:flex-row">
      <div className="flex flex-col gap-5 md:w-[350px]">
        {qualityStatisticsWithPopulation?.qualityStatistics.map((item) => (
          <div key={item.type}>
            <div className="text-lg font-bold">
              Enquêtes Sphères d&apos;Usages
            </div>
            <div className="mt-2 text-xs">Vous avez interrogé</div>
            <div className="text-xl font-bold">
              {`${new Intl.NumberFormat("fr-FR").format(item.sampleSize)} `}
              pers.
            </div>
            <div className="flex gap-4">
              <div>
                <div className="mt-2 text-xs">Intervalle de confiance</div>
                <div className="text-xl font-bold">
                  {item.confidence * 100} %
                </div>
              </div>
              <div>
                <div className="mt-2 text-xs">Marge d&apos;erreur</div>
                <div className="text-xl font-bold">
                  {(item.correctedMarginError * 100).toFixed(2)} %
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-1 my-5 border-x border-black" />
      <div className="flex-1">
        <div className="text-lg font-bold">
          Population de plus de 15 ans :{" "}
          {`${new Intl.NumberFormat("fr-FR").format(qualityStatisticsWithPopulation?.populationSum ?? 0)} `}
        </div>
        <div>
          Population générale :{" "}
          {`${new Intl.NumberFormat("fr-FR").format(qualityStatisticsWithPopulation?.populationSumWith15 ?? 0)} `}
        </div>
        {session?.user.surveyName && (
          <div className="flex flex-col gap-8">
            <div className="mt-5 flex flex-col flex-wrap gap-6 md:flex-row">
              <div className="flex-1">
                <div className="text-sm font-bold">
                  Répartion des âges dans le quartier :
                </div>
                <MetabaseIframe
                  iframeNumber={MetabaseIFrameNumber.RESULT_GENDER}
                  iframeType={MetabaseIframeType.QUESTION}
                  params={{ surveyName: session?.user.surveyName }}
                  height="250px"
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">Répartion du genre :</div>
                <MetabaseIframe
                  iframeNumber={MetabaseIFrameNumber.RESULT_AGE}
                  iframeType={MetabaseIframeType.QUESTION}
                  params={{ surveyName: session?.user.surveyName }}
                  height="250px"
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-bold">
                Répartion des CSP dans le quartier :
              </div>
              <MetabaseIframe
                iframeNumber={MetabaseIFrameNumber.RESULT_CS}
                iframeType={MetabaseIframeType.QUESTION}
                params={{ surveyName: session?.user.surveyName }}
                height="250px"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatQuality;

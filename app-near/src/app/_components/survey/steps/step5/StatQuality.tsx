import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";

const StatQuality: React.FC = () => {
  const { data: session } = useSession();
  const { data: qualityStatisticsWithPopulation } =
    api.analyzes.quality.useQuery(undefined, {
      enabled: !!session?.user.surveyId,
    });

  return (
    <div className="flex flex-col flex-wrap gap-3 md:flex-row">
      <div className="flex flex-1 flex-col gap-5 md:w-[400px]">
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
      <div className="border-1 my-3 border-x border-black" />
      <div className="flex-grow">
        <div className="text-lg font-bold">
          Population de plus de 15 ans :{" "}
          {`${new Intl.NumberFormat("fr-FR").format(qualityStatisticsWithPopulation?.populationSum ?? 0)} `}
        </div>
        <div>
          Population générale :{" "}
          {`${new Intl.NumberFormat("fr-FR").format(qualityStatisticsWithPopulation?.populationSumWith15 ?? 0)} `}
        </div>
      </div>
    </div>
  );
};

export default StatQuality;

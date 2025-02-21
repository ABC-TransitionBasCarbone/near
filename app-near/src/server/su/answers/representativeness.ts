import {
  type CategoryStat,
  categoryStatQuartierMap,
  type CategoryStats,
} from "~/types/SuAnswer";
import { db } from "../../db";
import { countAnswsers } from "./count";

// TODO NEAR-54: replace CategoryStats[] by CategoryStats (it's an array because it was result or raw query)
const representativeness = async (
  surveyId: number,
): Promise<CategoryStats[]> => {
  const suAnswersTotal = await countAnswsers(surveyId);
  console.log(suAnswersTotal);

  const suAnswersByAge = await db.suAnswer.groupBy({
    by: ["ageCategory"],
    where: { surveyId },
    _count: true,
  });
  console.log(suAnswersByAge);

  const suAnswersByGender = await db.suAnswer.groupBy({
    by: ["gender"],
    where: { surveyId },
    _count: true,
  });
  console.log(suAnswersByGender);

  const suAnswerByCS = await db.suAnswer.groupBy({
    by: ["professionalCategory"],
    where: { surveyId },
    _count: true,
  });
  console.log(suAnswerByCS);

  // TODO NEAR-54 handle case when there are no answers

  const neighborhood = await db.quartier.findFirst({ where: { surveyId } });
  if (!neighborhood) {
    throw new Error(); // TODO NEAR-54
  }
  const inseeStats = Object.entries(categoryStatQuartierMap).reduce(
    (acc, [categoryStat, dbcolumn]) => {
      acc[categoryStat as CategoryStat] =
        Number(neighborhood[dbcolumn]) / (neighborhood?.population_sum || 1);
      return acc;
    },
    {} as Record<CategoryStat, number>,
  );
  console.log(inseeStats);

  // TODO NEAR-54 return for all stat : inseeStats - (suAnswersStat / Math.max(target, suAnswersTotal))
  // return [{
  //   [CategoryStat.man]: ,
  //   [CategoryStat.woman]: ,
  //   [CategoryStat.cs1]: ,
  //   [CategoryStat.cs2]: ,
  //   [CategoryStat.cs3]: ,
  //   [CategoryStat.cs4]: ,
  //   [CategoryStat.cs5]: ,
  //   [CategoryStat.cs6]: ,
  //   [CategoryStat.cs7]: ,
  //   [CategoryStat.cs8]: ,
  //   [CategoryStat.from_15_to_29]: ,
  //   [CategoryStat.from_30_to_44]: ,
  //   [CategoryStat.from_45_to_59]: ,
  //   [CategoryStat.from_60_to_74]: ,
  //   [CategoryStat.above_75]: ,
  // }];
  return [];
};

const representativenessService = { representativeness };

export default representativenessService;

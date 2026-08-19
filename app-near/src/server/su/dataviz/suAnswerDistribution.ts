import { db } from "~/server/db";
import {
  CategoryStat,
  categoryStatQuartierMap,
  enumValueToCategoryStat,
} from "~/types/SuAnswer";
import { type SuAnswerCategoryField } from "~/shared/services/dataviz/suAnswerCategory";
import { toPercentage } from "~/shared/services/dataviz/percentage";
import { resolveSuId } from "~/server/su/dataviz/suSelection";

export type { SuAnswerCategoryField };

const FIELD_CATEGORIES: Record<SuAnswerCategoryField, CategoryStat[]> = {
  ageCategory: [
    CategoryStat.from_15_to_29,
    CategoryStat.from_30_to_44,
    CategoryStat.from_45_to_59,
    CategoryStat.from_60_to_74,
    CategoryStat.above_75,
  ],
  gender: [CategoryStat.man, CategoryStat.woman],
  professionalCategory: [
    CategoryStat.cs1,
    CategoryStat.cs2,
    CategoryStat.cs3,
    CategoryStat.cs4,
    CategoryStat.cs5,
    CategoryStat.cs6,
    CategoryStat.cs7,
    CategoryStat.cs8,
  ],
};

const CATEGORY_LABELS: Record<CategoryStat, { label: string; emoji: string }> =
  {
    [CategoryStat.from_15_to_29]: { label: "15-29 ans", emoji: "🧒" },
    [CategoryStat.from_30_to_44]: { label: "30-44 ans", emoji: "👨" },
    [CategoryStat.from_45_to_59]: { label: "45-59 ans", emoji: "👨‍💼" },
    [CategoryStat.from_60_to_74]: { label: "60-74 ans", emoji: "👴" },
    [CategoryStat.above_75]: { label: "75+ ans", emoji: "👵" },
    [CategoryStat.man]: { label: "Homme", emoji: "👨" },
    [CategoryStat.woman]: { label: "Femme", emoji: "👩" },
    [CategoryStat.cs1]: { label: "Agriculteurs exploitants", emoji: "🚜" },
    [CategoryStat.cs2]: {
      label: "Artisans, commerçants, chefs d'entreprise",
      emoji: "🔨",
    },
    [CategoryStat.cs3]: {
      label: "Cadres et professions intellectuelles supérieures",
      emoji: "👔",
    },
    [CategoryStat.cs4]: { label: "Professions intermédiaires", emoji: "👨‍💼" },
    [CategoryStat.cs5]: { label: "Employés", emoji: "👩‍💻" },
    [CategoryStat.cs6]: { label: "Ouvriers", emoji: "👷" },
    [CategoryStat.cs7]: { label: "Retraités", emoji: "👴" },
    [CategoryStat.cs8]: {
      label: "Autres personnes sans activité professionnelle",
      emoji: "🏠",
    },
  };

export type SuAnswerDistributionResult = {
  data: {
    category: CategoryStat;
    label: string;
    emoji: string;
    count: number;
    percentage: number;
  }[];
  isNeighborhood: boolean;
  totalResponses: number;
};

export const getSuAnswerDistribution = async (
  surveyId: number,
  field: SuAnswerCategoryField,
  selectedSus?: number[],
): Promise<SuAnswerDistributionResult> => {
  const categories = FIELD_CATEGORIES[field];
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  if (!isNeighborhood) {
    const counts = await db.suAnswer.groupBy({
      by: [field],
      where: { surveyId, suId },
      _count: true,
    });

    const totals = new Map<CategoryStat, number>();
    for (const c of counts) {
      const category = enumValueToCategoryStat[c[field]];
      if (!category) continue;
      totals.set(category, (totals.get(category) ?? 0) + c._count);
    }

    const totalResponses = [...totals.values()].reduce((sum, n) => sum + n, 0);

    return {
      isNeighborhood: false,
      totalResponses,
      data: categories.map((category) => ({
        category,
        ...CATEGORY_LABELS[category],
        count: totals.get(category) ?? 0,
        percentage: toPercentage(totals.get(category) ?? 0, totalResponses),
      })),
    };
  }

  const neighborhood = await db.quartier.findUnique({ where: { surveyId } });
  if (!neighborhood) {
    return { data: [], isNeighborhood: true, totalResponses: 0 };
  }

  const totalResponses = categories.reduce(
    (sum, category) =>
      sum + Number(neighborhood[categoryStatQuartierMap[category]]),
    0,
  );

  return {
    isNeighborhood: true,
    totalResponses,
    data: categories.map((category) => {
      const count = Number(neighborhood[categoryStatQuartierMap[category]]);
      return {
        category,
        ...CATEGORY_LABELS[category],
        count,
        percentage: toPercentage(count, totalResponses),
      };
    }),
  };
};

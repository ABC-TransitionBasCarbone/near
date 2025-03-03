import { AgeCategory, Gender, ProfessionalCategory } from "@prisma/client";
import { db } from "../../db";
import { CategoryStat } from "~/types/SuAnswer";

export const countAnswers = async (surveyId: number): Promise<number> => {
  return db.suAnswer.count({ where: { surveyId } });
};

const convertEnumToInseeKeys: Record<
  AgeCategory | Gender | ProfessionalCategory,
  CategoryStat | undefined
> = {
  [AgeCategory.ABOVE_75]: CategoryStat.above_75,
  [AgeCategory.FROM_15_TO_29]: CategoryStat.from_15_to_29,
  [AgeCategory.FROM_30_TO_44]: CategoryStat.from_30_to_44,
  [AgeCategory.FROM_45_TO_59]: CategoryStat.from_45_to_59,
  [AgeCategory.FROM_60_TO_74]: CategoryStat.from_60_to_74,
  [Gender.MAN]: CategoryStat.man,
  [Gender.WOMAN]: CategoryStat.woman,
  [Gender.OTHER]: undefined, // Insee has no target. Could be an issue to reach the target if we collect a lot of other genders
  [ProfessionalCategory.CS1]: CategoryStat.cs1,
  [ProfessionalCategory.CS2]: CategoryStat.cs2,
  [ProfessionalCategory.CS3]: CategoryStat.cs3,
  [ProfessionalCategory.CS4]: CategoryStat.cs4,
  [ProfessionalCategory.CS5]: CategoryStat.cs5,
  [ProfessionalCategory.CS6]: CategoryStat.cs6,
  [ProfessionalCategory.CS7]: CategoryStat.cs7,
  [ProfessionalCategory.CS8_student]: CategoryStat.cs8,
  [ProfessionalCategory.CS8_unemployed]: CategoryStat.cs8,
};

export const countAnswersByCategories = async (
  surveyId: number,
  category: "ageCategory" | "gender" | "professionalCategory",
) => {
  const result = await db.suAnswer.groupBy({
    by: [category],
    where: { surveyId },
    _count: true,
  });

  return result.reduce(
    (acc, item) => {
      const key = convertEnumToInseeKeys[item[category]];
      if (!key) {
        return acc;
      }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      acc[key] = (acc[key] || 0) + item._count;
      return acc;
    },
    {} as Partial<Record<CategoryStat, number>>,
  );
};

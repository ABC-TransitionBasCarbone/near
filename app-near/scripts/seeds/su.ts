import { faker } from "@faker-js/faker";
import {
  AgeCategory,
  Gender,
  ProfessionalCategory,
  type Quartier,
} from "@prisma/client";
import { db } from "~/server/db";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import { select } from "weighted";
import targetService from "~/server/neighborhoods/targets";
import { TRPCError } from "@trpc/server";
import { type CategoryStat } from "~/types/SuAnswer";

export enum SurveyCase {
  LESS_THAN_GLOBAL_TARGET = "LESS_THAN_GLOBAL_TARGET",
  MORE_THAN_GLOBAL_TARGET = "MORE_THAN_GLOBAL_TARGET",
  MORE_THAN_CATEGORIES_TARGETS = "MORE_THAN_CATEGORIES_TARGETS",
}

const getAnswerQuantity = (
  surveyCase: SurveyCase,
  surveyTarget: number,
): number => {
  switch (surveyCase) {
    case SurveyCase.LESS_THAN_GLOBAL_TARGET:
      return faker.number.int({
        min: Math.floor(surveyTarget / 2),
        max: surveyTarget - 1,
      });
    case SurveyCase.MORE_THAN_CATEGORIES_TARGETS:
    case SurveyCase.MORE_THAN_GLOBAL_TARGET:
      return faker.number.int({
        min: 5 * surveyTarget,
        max: 10 * surveyTarget,
      });
    default:
      return 0;
  }
};

const verifySurveyTarget = (surveyTarget: number, quartier: Quartier) => {
  const allowedSurveyTargets = [
    quartier.population_sum_threshold_5p,
    quartier.population_sum_threshold_4_5p,
    quartier.population_sum_threshold_4p,
    quartier.population_sum_threshold_3p,
  ].map((val) => Math.round(val / 100) * 100);

  if (!allowedSurveyTargets.includes(surveyTarget)) {
    throw new Error(`
Survey target (${surveyTarget}) not allowed. 

Usage: npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_GLOBAL_TARGET

Valid values for surveyTarget: ${allowedSurveyTargets.join(", ")}
`);
  }
};

export const seedSuSurvey = async (
  surveyName: string | undefined,
  surveyTarget: number | undefined,
  surveyCase: SurveyCase | undefined,
) => {
  if (
    !surveyName ||
    !surveyTarget ||
    !surveyCase ||
    !Object.values(SurveyCase).includes(surveyCase)
  ) {
    throw new Error(`
surveyName (${surveyName}) or surveyTarget (${surveyTarget}) or surveyCase (${surveyCase}) not defined. 

Usage: npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_GLOBAL_TARGET

Valid values for surveyCase: ${Object.values(SurveyCase)
      .map((item) => `${item}`)
      .join(", ")}`);
  }

  const survey = await db.survey.findUnique({
    where: { name: surveyName },
    include: { quartier: true },
  });

  if (!survey) {
    const existingSurveys = await db.survey.findMany({
      select: { name: true },
    });
    throw new Error(`
Usage: npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_GLOBAL_TARGET

Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
    `);
  }

  if (!survey.quartier) {
    throw new Error('Can not use "survey" that has null "quartier".');
  }

  verifySurveyTarget(surveyTarget, survey.quartier);

  await db.survey.update({
    data: { sampleTarget: surveyTarget },
    where: { name: surveyName },
  });

  await db.suAnswer.deleteMany({
    where: { surveyId: survey.id },
  });

  let answerTargetsByCategories: Partial<Record<CategoryStat, number>> = {};
  try {
    answerTargetsByCategories = await targetService.getInseeTargetsByCategories(
      survey.id,
    );
  } catch (error) {
    if (error instanceof TRPCError) {
      const existingSurveys = await db.survey.findMany({
        select: { name: true },
      });
      throw new Error(`
      survey not found. 
      
      Usage: npm run seed -- scope=su_answer surveyName="Porte d'Orléans" surveyTarget=400 surveyCase=LESS_THAN_GLOBAL_TARGET
      
      Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
      `);
    }
    throw Error("unexpected error");
  }
  const answerQuantity = getAnswerQuantity(surveyCase, surveyTarget);

  for (let index = 0; index < answerQuantity; index++) {
    await db.suAnswer.create({
      data: buildSuAnswer(
        survey.id,
        surveyCase === SurveyCase.MORE_THAN_CATEGORIES_TARGETS
          ? {
              gender: select({
                [Gender.MAN]: answerTargetsByCategories.man,
                [Gender.WOMAN]: answerTargetsByCategories.woman,
              }),
              professionalCategory: select({
                [ProfessionalCategory.CS1]: answerTargetsByCategories.cs1,
                [ProfessionalCategory.CS2]: answerTargetsByCategories.cs2! / 2,
                [ProfessionalCategory.CS2_platform_entrepreneurship]:
                  answerTargetsByCategories.cs2! / 2,
                [ProfessionalCategory.CS3]: answerTargetsByCategories.cs3,
                [ProfessionalCategory.CS4]: answerTargetsByCategories.cs4,
                [ProfessionalCategory.CS5]: answerTargetsByCategories.cs5,
                [ProfessionalCategory.CS6]: answerTargetsByCategories.cs6,
                [ProfessionalCategory.CS7]: answerTargetsByCategories.cs7,
                [ProfessionalCategory.CS8_student]:
                  answerTargetsByCategories.cs8! / 3,
                [ProfessionalCategory.CS8_home]:
                  answerTargetsByCategories.cs8! / 3,
                [ProfessionalCategory.CS8_unemployed]:
                  answerTargetsByCategories.cs8! / 3,
              }),
              ageCategory: select({
                [AgeCategory.ABOVE_75]: answerTargetsByCategories.above_75,
                [AgeCategory.FROM_15_TO_29]:
                  answerTargetsByCategories.from_15_to_29,
                [AgeCategory.FROM_30_TO_44]:
                  answerTargetsByCategories.from_30_to_44,
                [AgeCategory.FROM_45_TO_59]:
                  answerTargetsByCategories.from_45_to_59,
                [AgeCategory.FROM_60_TO_74]:
                  answerTargetsByCategories.from_60_to_74,
              }),
            }
          : undefined,
      ),
    });
  }
};

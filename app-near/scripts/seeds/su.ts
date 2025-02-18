import { faker } from "@faker-js/faker";
import { db } from "~/server/db";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";
import {
  CategoryStat,
  categoryStatAnswerMap,
  categoryStatQuartierMap,
} from "~/types/SuAnswer";

export enum SurveyCase {
  LESS_THAN_GLOBAL_TARGET = "LESS_THAN_GLOBAL_TARGET",
  MORE_THAN_GLOBAL_TARGET = "MORE_THAN_GLOBAL_TARGET",
  MORE_THAN_CATEGORIES_TARGETS = "MORE_THAN_CATEGORIES_TARGETS",
}

const getAnswerTargetsByCategories = async (
  surveyId: number,
): Promise<Record<CategoryStat, number>> => {
  const neighborhood = await db.quartier.findFirst({ where: { surveyId } });
  if (!neighborhood) {
    const existingSurveys = await db.survey.findMany({
      select: { name: true },
    });

    throw new Error(`
survey not found. 

Usage: npm run seed -- scope=su_answer surveyName=14e_arr surveyTarget=60 surveyCase=LESS_THAN_TARGET

Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
`);
  }
  return Object.entries(categoryStatQuartierMap).reduce(
    (acc, [categoryStat, dbcolumn]) => {
      acc[categoryStat as CategoryStat] =
        Number(neighborhood[dbcolumn]) / (neighborhood?.population_sum || 1);
      return acc;
    },
    {} as Record<CategoryStat, number>,
  );
};

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
        min: surveyTarget + Math.floor(surveyTarget / 2),
        max: surveyTarget + Math.floor(surveyTarget),
      });
    default:
      return 0;
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

Usage: npm run seed -- scope=su_answer surveyName=14e_arr surveyTarget=60 surveyCase=LESS_THAN_TARGET

Valid values for surveyCase: ${Object.values(SurveyCase)
      .map((item) => `${item}`)
      .join(", ")}`);
  }

  const survey = await db.survey.findFirst({ where: { name: surveyName } });

  if (!survey) {
    const existingSurveys = await db.survey.findMany({
      select: { name: true },
    });
    throw new Error(`
Usage: npm run seed -- scope=su_answer surveyName=14e_arr surveyTarget=60 surveyCase=LESS_THAN_TARGET

Valid values for surveyName: ${existingSurveys.map((item) => item.name).join(", ")}
    `);
  } else {
    await db.survey.update({
      data: { sampleTarget: surveyTarget },
      where: { name: surveyName },
    });

    await db.suAnswer.deleteMany({
      where: { surveyId: survey.id },
    });
  }

  const answerTargetsByCategories = await getAnswerTargetsByCategories(
    survey.id,
  );

  for (const answerCategory in answerTargetsByCategories) {
    const quantity = Math.floor(
      getAnswerQuantity(surveyCase, surveyTarget) *
        answerTargetsByCategories[answerCategory as CategoryStat],
    );

    if (
      (answerCategory as CategoryStat) === CategoryStat.man &&
      surveyCase === SurveyCase.MORE_THAN_GLOBAL_TARGET
    ) {
      continue;
    }
    for (let index = 0; index < quantity; index++) {
      await db.suAnswer.create({
        data: buildSuAnswer(
          survey.id,
          categoryStatAnswerMap[answerCategory as CategoryStat],
        ),
      });
    }
  }
};

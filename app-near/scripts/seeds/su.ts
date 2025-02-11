import { faker } from "@faker-js/faker";
import { db } from "~/server/db";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";

export enum SurveyCase {
  LESS_THAN_TARGET = "LESS_THAN_TARGET",
  MORE_THAN_TARGET = "MORE_THAN_TARGET",
}

const getAnswerQuantity = (
  surveyCase: SurveyCase,
  surveyTarget: number,
): number => {
  switch (surveyCase) {
    case SurveyCase.LESS_THAN_TARGET:
      return faker.number.int({
        min: Math.floor(surveyTarget / 2),
        max: surveyTarget - 1,
      });
    case SurveyCase.MORE_THAN_TARGET:
      return faker.number.int({
        min: surveyTarget,
        max: surveyTarget + Math.floor(surveyTarget / 2),
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

  let survey = await db.survey.findFirst({ where: { name: surveyName } });

  if (!survey) {
    survey = await db.survey.create({
      data: { name: surveyName, sampleTarget: surveyTarget },
    });
  } else {
    await db.survey.update({
      data: { sampleTarget: surveyTarget },
      where: { name: surveyName },
    });

    await db.suAnswer.deleteMany({
      where: { surveyId: survey.id },
    });
  }

  await Promise.all(
    Array.from(
      { length: getAnswerQuantity(surveyCase, surveyTarget) },
      (el, index) => index,
    ).map(() => {
      return db.suAnswer.create({
        data: buildSuAnswer(survey.id),
      });
    }),
  );
};

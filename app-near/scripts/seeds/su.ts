import { faker } from "@faker-js/faker";
import { db } from "~/server/db";
import { buildSuAnswer } from "~/server/test-utils/create-data/suAnswer";

export enum SurveyCase {
  CAS_1 = "case_1",
  CAS_2 = "case_2",
}

const surveyCaseDescription: Record<SurveyCase, string> = {
  [SurveyCase.CAS_1]: "less than target",
  [SurveyCase.CAS_2]: "more than target",
};

const getAnswerQuantity = (
  surveyCase: SurveyCase,
  surveyTarget: number,
): number => {
  switch (surveyCase) {
    case SurveyCase.CAS_1:
      return faker.number.int({
        min: Math.floor(surveyTarget / 2),
        max: surveyTarget - 1,
      });
    case SurveyCase.CAS_2:
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

Usage: npm run seed -- scope=su_answer surveyName=14e_arr surveyTarget=60 surveyCase=case_1

Valid values for surveyCase: ${Object.values(SurveyCase)
      .map((item) => `${item} (${surveyCaseDescription[item]})`)
      .join(", ")}`);
  }

  const survey = await db.survey.findFirst({ where: { name: surveyName } });

  if (!survey) {
    await db.survey.create({
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
        data: buildSuAnswer(1),
      });
    }),
  );
};

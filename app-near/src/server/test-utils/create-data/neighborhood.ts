import { SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";

export const createNeighborhood = async (surveyName: string) => {
  const survey = await db.survey.create({
    data: {
      name: surveyName,
      phase: SurveyPhase.STEP_2_SU_SURVERY,
      sampleTarget: 3,
    },
  });

  await db.$queryRawUnsafe(`CREATE OR REPLACE VIEW quartiers AS
      SELECT 
        ${survey.id} AS survey_id,
        ARRAY['75014', '75015', '75016']::text[] AS iris_selectors,
        1100::double precision AS population_sum_with_under_fifteen,
        1000::double precision AS population_sum,
        180::double precision AS p21_pop1529_sum,
        230::double precision AS p21_pop3044_sum,
        170::double precision AS p21_pop4559_sum,
        200::double precision AS p21_pop6074_sum,
        220::double precision AS p21_pop75p_sum,
        220::double precision AS c21_pop15p_cs1_sum,
        110::double precision AS c21_pop15p_cs2_sum,
        180::double precision AS c21_pop15p_cs3_sum,
        150::double precision AS c21_pop15p_cs4_sum,
        50::double precision AS c21_pop15p_cs5_sum,
        120::double precision AS c21_pop15p_cs6_sum,
        80::double precision AS c21_pop15p_cs7_sum,
        90::double precision AS c21_pop15p_cs8_sum,
        560::double precision AS population_femme_sum,
        440::double precision AS population_homme_sum,
        0::double precision AS population_sum_threshold_3p,
        0::double precision AS population_sum_threshold_4p,
        0::double precision AS population_sum_threshold_5p,
        0::double precision AS population_sum_threshold_4_5p
        ;`);

  return survey;
};

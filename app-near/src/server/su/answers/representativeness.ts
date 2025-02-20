import { db } from "../../db";

type CategoryStats = {
  man: number;
  woman: number;
  above_75: number;
  from_60_to_74: number;
  from_45_to_59: number;
  from_30_to_44: number;
  from_15_to_29: number;
  cs1: number;
  cs2: number;
  cs3: number;
  cs4: number;
  cs5: number;
  cs6: number;
  cs7: number;
  cs8: number;
};

export const representativeness = async (
  surveyId: number,
): Promise<CategoryStats[]> => {
  return await db.$queryRaw`
    WITH
    SURVEY_STATS AS (
      SELECT
        COUNT(*) FILTER (WHERE GENDER = 'MAN')::DECIMAL / COUNT(*) AS MAN_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE GENDER = 'WOMAN')::DECIMAL / COUNT(*) AS WOMAN_RATIO_SURVEY,
        
        COUNT(*) FILTER (WHERE AGE_CATEGORY = 'ABOVE_75')::DECIMAL / COUNT(*) AS ABOVE_75_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE AGE_CATEGORY = 'FROM_60_TO_74')::DECIMAL / COUNT(*) AS FROM_60_TO_74_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE AGE_CATEGORY = 'FROM_45_TO_59')::DECIMAL / COUNT(*) AS FROM_45_TO_59_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE AGE_CATEGORY = 'FROM_30_TO_44')::DECIMAL / COUNT(*) AS FROM_30_TO_44_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE AGE_CATEGORY = 'FROM_15_TO_29')::DECIMAL / COUNT(*) AS FROM_15_TO_29_RATIO_SURVEY,
        
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS1')::DECIMAL / COUNT(*) AS CS1_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS2')::DECIMAL / COUNT(*) AS CS2_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS3')::DECIMAL / COUNT(*) AS CS3_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS4')::DECIMAL / COUNT(*) AS CS4_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS5')::DECIMAL / COUNT(*) AS CS5_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS6')::DECIMAL / COUNT(*) AS CS6_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS7')::DECIMAL / COUNT(*) AS CS7_RATIO_SURVEY,
        COUNT(*) FILTER (WHERE PROFESSIONAL_CATEGORY = 'CS8_unemployed')::DECIMAL / COUNT(*) AS CS8_RATIO_SURVEY
      FROM
        PUBLIC.SU_ANSWER
      WHERE
        "surveyId" = ${surveyId}
    ),
    INSEE_STATS AS (
    SELECT
      (POPULATION_HOMME_SUM::DECIMAL / POPULATION_SUM) AS MAN_RATIO_INSEE,
      (POPULATION_FEMME_SUM::DECIMAL / POPULATION_SUM) AS WOMAN_RATIO_INSEE,

      (p21_pop75p_sum::DECIMAL / POPULATION_SUM) AS ABOVE_75_RATIO_INSEE,
      (p21_pop6074_sum::DECIMAL / POPULATION_SUM) AS FROM_60_TO_74_RATIO_INSEE,
      (p21_pop4559_sum::DECIMAL / POPULATION_SUM) AS FROM_45_TO_59_RATIO_INSEE,
      (p21_pop3044_sum::DECIMAL / POPULATION_SUM) AS FROM_30_TO_44_RATIO_INSEE,
      (p21_pop1529_sum::DECIMAL / POPULATION_SUM) AS FROM_15_TO_29_RATIO_INSEE,
      -- TODO: add under 15  computational diff


      (c21_pop15p_cs1_sum::DECIMAL / POPULATION_SUM) AS CS1_RATIO_INSEE,
      (c21_pop15p_cs2_sum::DECIMAL / POPULATION_SUM) AS CS2_RATIO_INSEE,
      (c21_pop15p_cs3_sum::DECIMAL / POPULATION_SUM) AS CS3_RATIO_INSEE,
      (c21_pop15p_cs4_sum::DECIMAL / POPULATION_SUM) AS CS4_RATIO_INSEE,
      (c21_pop15p_cs5_sum::DECIMAL / POPULATION_SUM) AS CS5_RATIO_INSEE,
      (c21_pop15p_cs6_sum::DECIMAL / POPULATION_SUM) AS CS6_RATIO_INSEE,
      (c21_pop15p_cs7_sum::DECIMAL / POPULATION_SUM) AS CS7_RATIO_INSEE,
      (c21_pop15p_cs8_sum::DECIMAL / POPULATION_SUM) AS CS8_RATIO_INSEE
    FROM
      QUARTIERS where survey_id = ${surveyId}
  )
  SELECT
    -- *,
    ROUND(((MAN_RATIO_INSEE - MAN_RATIO_SURVEY)*100)::numeric,2) as MAN,
    ROUND(((WOMAN_RATIO_INSEE - WOMAN_RATIO_SURVEY)*100)::numeric,2) as WOMAN,
    ROUND(((ABOVE_75_RATIO_INSEE - ABOVE_75_RATIO_SURVEY)*100)::numeric,2) as ABOVE_75,
    ROUND(((FROM_60_TO_74_RATIO_INSEE - FROM_60_TO_74_RATIO_SURVEY)*100)::numeric,2) as FROM_60_TO_74,
    ROUND(((FROM_45_TO_59_RATIO_INSEE - FROM_45_TO_59_RATIO_SURVEY)*100)::numeric,2) as FROM_45_TO_59,
    ROUND(((FROM_30_TO_44_RATIO_INSEE - FROM_30_TO_44_RATIO_SURVEY)*100)::numeric,2) as FROM_30_TO_44,
    ROUND(((FROM_15_TO_29_RATIO_INSEE - FROM_15_TO_29_RATIO_SURVEY)*100)::numeric,2) as FROM_15_TO_29,
    ROUND(((CS1_RATIO_INSEE - CS1_RATIO_SURVEY)*100)::numeric,2) as CS1,
    ROUND(((CS2_RATIO_INSEE - CS2_RATIO_SURVEY)*100)::numeric,2) as CS2,
    ROUND(((CS3_RATIO_INSEE - CS3_RATIO_SURVEY)*100)::numeric,2) as CS3,
    ROUND(((CS4_RATIO_INSEE - CS4_RATIO_SURVEY)*100)::numeric,2) as CS4,
    ROUND(((CS5_RATIO_INSEE - CS5_RATIO_SURVEY)*100)::numeric,2) as CS5,
    ROUND(((CS6_RATIO_INSEE - CS6_RATIO_SURVEY)*100)::numeric,2) as CS6,
    ROUND(((CS7_RATIO_INSEE - CS7_RATIO_SURVEY)*100)::numeric,2) as CS7,
    ROUND(((CS8_RATIO_INSEE - CS8_RATIO_SURVEY)*100)::numeric,2) as CS8
    -- TODO: add under 15 computational diff
  FROM
    SURVEY_STATS
    CROSS JOIN INSEE_STATS
  `;
};

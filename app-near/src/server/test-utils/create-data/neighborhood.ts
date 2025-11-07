import { type Survey, SurveyPhase } from "@prisma/client";
import { db } from "~/server/db";

export const createNeighborhood = async (
  surveyName: string,
): Promise<Survey> => {
  return db.survey.create({
    data: {
      name: surveyName,
      phase: SurveyPhase.STEP_2_SU_SURVERY,
      sampleTarget: 3,
      quartier: {
        create: {
          iris_selectors: ["75014", "75015", "75016"],
          c21_pop15p_cs1_sum: 220,
          c21_pop15p_cs2_sum: 110,
          c21_pop15p_cs3_sum: 180,
          c21_pop15p_cs4_sum: 150,
          c21_pop15p_cs5_sum: 50,
          c21_pop15p_cs6_sum: 120,
          c21_pop15p_cs7_sum: 80,
          c21_pop15p_cs8_sum: 90,
          p21_pop1529_sum: 180,
          p21_pop3044_sum: 230,
          p21_pop4559_sum: 170,
          p21_pop6074_sum: 200,
          p21_pop75p_sum: 220,
          population_femme_sum: 560,
          population_homme_sum: 440,
          population_sum: 1000,
          population_sum_threshold_3p: 0,
          population_sum_threshold_4p: 0,
          population_sum_threshold_5p: 0,
          population_sum_threshold_4_5p: 0,
          population_sum_with_under_fifteen: 1100,
        },
      },
    },
  });
};

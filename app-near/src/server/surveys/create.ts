import { type Survey } from "@prisma/client";
import { db } from "../db";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

const calculateSampleSize = (
  marginOfError: number,
  population: number,
  confidenceLevel = 1.96,
) => {
  const p = 0.5;
  return !population
    ? 0
    : (Math.pow(confidenceLevel, 2) * p * (1 - p)) /
        (Math.pow(marginOfError, 2) +
          (Math.pow(confidenceLevel, 2) * 0.25) / population);
};

const verifySurveyName = async (name: string) => {
  const existinSurveyWithName = await db.survey.findFirst({
    where: { name },
  });

  if (existinSurveyWithName) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: ErrorCode.EXISTING_SURVEY_NAME,
    });
  }
};

const verifyIris = async (irisList: string[]) => {
  const iris = await db.inseeIris2021.findMany({ select: { iris: true } });
  const validIrisList = iris.map((item) => item.iris);

  if (irisList.some((item) => !validIrisList.includes(item))) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: ErrorCode.WRONG_IRIS,
    });
  }
};

export const createSurvey = async (
  surveyName: string,
  irisSelectors: string[],
): Promise<Survey> => {
  await verifySurveyName(surveyName);
  await verifyIris(irisSelectors);

  const inseeData = await db.inseeIris2021.aggregate({
    _sum: {
      p21_pop: true,
      c21_pop15p: true,
      p21_pop1529: true,
      p21_pop3044: true,
      p21_pop4559: true,
      p21_pop6074: true,
      p21_pop75p: true,
      c21_pop15p_cs1: true,
      c21_pop15p_cs2: true,
      c21_pop15p_cs3: true,
      c21_pop15p_cs4: true,
      c21_pop15p_cs5: true,
      c21_pop15p_cs6: true,
      c21_pop15p_cs7: true,
      c21_pop15p_cs8: true,
      c21_f15p: true,
      c21_h15p: true,
    },
    where: { iris: { in: irisSelectors } },
  });

  const sampleSize3p = calculateSampleSize(
    0.03,
    inseeData._sum.c21_pop15p ?? 0,
  );
  const sampleSize4p = calculateSampleSize(
    0.04,
    inseeData._sum.c21_pop15p ?? 0,
  );
  const sampleSize5p = calculateSampleSize(
    0.05,
    inseeData._sum.c21_pop15p ?? 0,
  );

  return db.survey.create({
    data: {
      name: surveyName,
      quartier: {
        create: {
          iris_selectors: irisSelectors,
          c21_pop15p_cs1_sum: inseeData._sum.c21_pop15p_cs1 ?? 0,
          c21_pop15p_cs2_sum: inseeData._sum.c21_pop15p_cs2 ?? 0,
          c21_pop15p_cs3_sum: inseeData._sum.c21_pop15p_cs3 ?? 0,
          c21_pop15p_cs4_sum: inseeData._sum.c21_pop15p_cs4 ?? 0,
          c21_pop15p_cs5_sum: inseeData._sum.c21_pop15p_cs5 ?? 0,
          c21_pop15p_cs6_sum: inseeData._sum.c21_pop15p_cs6 ?? 0,
          c21_pop15p_cs7_sum: inseeData._sum.c21_pop15p_cs7 ?? 0,
          c21_pop15p_cs8_sum: inseeData._sum.c21_pop15p_cs8 ?? 0,
          p21_pop1529_sum: inseeData._sum.p21_pop1529 ?? 0,
          p21_pop3044_sum: inseeData._sum.p21_pop3044 ?? 0,
          p21_pop4559_sum: inseeData._sum.p21_pop4559 ?? 0,
          p21_pop6074_sum: inseeData._sum.p21_pop6074 ?? 0,
          p21_pop75p_sum: inseeData._sum.p21_pop75p ?? 0,
          population_femme_sum: inseeData._sum.c21_f15p ?? 0,
          population_homme_sum: inseeData._sum.c21_h15p ?? 0,
          population_sum: inseeData._sum.c21_pop15p ?? 0,
          population_sum_threshold_3p: sampleSize3p,
          population_sum_threshold_4p: sampleSize4p,
          population_sum_threshold_5p: sampleSize5p,
          population_sum_threshold_4_5p: (sampleSize4p + sampleSize5p) / 2,
          population_sum_with_under_fifteen: inseeData._sum.p21_pop ?? 0,
        },
      },
    },
  });
};

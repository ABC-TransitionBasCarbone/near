import { Prisma, type Survey } from "@prisma/client";
import { db } from "../db";
import { type PaginatedResult } from "~/types/Table";

export const getOneSurvey = async (id: number) => {
  return db.survey.findUnique({
    where: { id },
    include: {
      quartier: true,
    },
  });
};

export const querySurveys = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<PaginatedResult<Survey>> => {
  const where: Prisma.SurveyWhereInput = filter
    ? { name: { contains: filter, mode: Prisma.QueryMode.insensitive } }
    : {};

  const [items, total] = await Promise.all([
    db.survey.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.survey.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

export const getOneSurveyByName = async (name: string) => {
  return db.survey.findUnique({
    where: { name },
  });
};

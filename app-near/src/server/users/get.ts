import { Prisma, type User } from "@prisma/client";
import { type PaginatedResult } from "~/types/Table";
import { db } from "../db";

export const getOneUser = async (id: number) => {
  return db.user.findUnique({
    where: { id },
  });
};

export const queryUsers = async (
  page: number,
  limit: number,
  filter?: string,
): Promise<PaginatedResult<User>> => {
  const where: Prisma.UserWhereInput = filter
    ? { email: { contains: filter, mode: Prisma.QueryMode.insensitive } }
    : {};

  const [items, total] = await Promise.all([
    db.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        survey: true,
      },
    }),
    db.user.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};

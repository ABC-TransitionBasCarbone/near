import { db } from "../db";

export const getAllInseeIris = async (search: string) => {
  return db.inseeIris2021.findMany({
    where: { iris: { contains: search } },
    select: { iris: true },
  });
};

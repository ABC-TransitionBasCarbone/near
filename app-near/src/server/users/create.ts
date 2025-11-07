import { RoleName, type User } from "@prisma/client";
import { db } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

const generateTmpPassword = (length = 12) => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&";
  let password = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[bytes[i]! % charset.length];
  }
  return password;
};

export const createPiloteUser = async (
  email: string,
  surveyId: number,
): Promise<User & { password: string }> => {
  const existingUser = await db.user.findFirst({ where: { email } });
  if (existingUser) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.EXISTING_USER_EMAIL,
    });
  }

  const password = generateTmpPassword(10);
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email: email,
      surveyId: surveyId,
      passwordHash,
      roles: {
        connect: [{ name: RoleName.PILOTE }],
      },
    },
  });

  return {
    ...user,
    password: password,
  };
};

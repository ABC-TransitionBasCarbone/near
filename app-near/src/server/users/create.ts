import { type User } from "@prisma/client";
import { db } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";

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

export const createUser = async (
  email: string,
  surveyId: number,
): Promise<User & { password: string }> => {
  const password = generateTmpPassword(10);
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: {
      email: email,
      surveyId: surveyId,
      passwordHash,
    },
  });

  return {
    ...user,
    password: password,
  };
};

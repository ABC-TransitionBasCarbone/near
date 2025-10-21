import { type NextAuthUser } from "~/types/NextAuth";
import { db } from "../db";
import bcrypt from "bcrypt";
import { RoleName } from "@prisma/client";

export const login = async (
  email: string,
  password: string,
): Promise<{
  message: string;
  success: boolean;
  user?: NextAuthUser;
}> => {
  const user = await db.user.findUnique({
    where: { email },
    include: { roles: true },
  });

  if (!user) return { message: "Accès non autorisé", success: false };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return { message: "Accès non autorisé", success: false };

  const userRoles = user.roles.map((role) => role.name);
  let userSurvey;

  if (userRoles.includes(RoleName.PILOTE)) {
    if (!user.surveyId) {
      return { message: "Accès non autorisé", success: false };
    }
    userSurvey = await db.survey.findFirstOrThrow({
      where: { id: user.surveyId },
    });

    if (!userSurvey) {
      console.error(`Aucune enquête trouvée accès non autorisé.`);
      return { message: "Accès non autorisé", success: false };
    }
  }

  return {
    message: "Accès validé",
    success: true,
    user: {
      email,
      survey: userSurvey
        ? { id: userSurvey.id, name: userSurvey.name }
        : undefined,
      roles: userRoles,
    },
  };
};

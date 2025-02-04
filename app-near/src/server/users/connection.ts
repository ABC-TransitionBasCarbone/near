import { env } from "~/env";
import { type NextAuthUser } from "~/types/NextAuth";
import { db } from "../db";

const getUserNameAndPassword = (input: string) => {
  const parts = input.split(":");
  if (parts.length === 2) {
    const [userName, password] = parts;
    return { userName, password };
  } else {
    throw new Error("Le format attendu est 'user:password'.");
  }
};

export const login = async (
  email: string,
  password: string,
): Promise<{
  message: string;
  success: boolean;
  user?: NextAuthUser;
}> => {
  const { userName: validUserName, password: validPassword } =
    getUserNameAndPassword(env.SUPER_ADMIN);

  if (email !== validUserName || password !== validPassword) {
    return { message: "Accès non autorisé", success: false };
  }

  const userSurvey = await db.survey.findFirst();

  if (!userSurvey) {
    console.debug(`Aucune enquête trouvée accès non autorisé.`);
    return { message: "Accès non autorisé", success: false };
  }

  return {
    message: "Accès validé",
    success: true,
    user: {
      email,
      surveyId: userSurvey.id,
    },
  };
};

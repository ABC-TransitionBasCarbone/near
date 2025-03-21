import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { type NextAuthUser } from "~/types/NextAuth";
import { login } from "../users/connection";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NextAuthUser & DefaultSession["user"];
  }
}

declare module "next/server" {
  interface NextRequest {
    user: NextAuthUser;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  pages: {
    signIn: "/connexion",
    error: "/connexion",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const connexion = await login(
          credentials.email as string,
          credentials.password as string,
        );

        if (!connexion.success) {
          return null;
        }

        return connexion.user!;
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url === `${baseUrl}/connexion`) {
        return `${baseUrl}`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async signIn() {
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const currentUser = user as NextAuthUser;
        return {
          ...token,
          userId: user.id,
          email: currentUser.email,
          surveyId: currentUser.surveyId,
          surveyName: currentUser.surveyName,
        };
      }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            ...token,
          },
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

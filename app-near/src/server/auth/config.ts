import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { type NextAuthUser } from "~/types/NextAuth";
import { login } from "../users/connection";
import { db } from "../db";

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
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.password || !credentials.email) return null;

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
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1h
  },
  jwt: {
    maxAge: 60 * 60, // 1h
  },
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
      const now = Date.now();

      // when user is just loged in: generate token
      if (user) {
        const currentUser = user as NextAuthUser;
        return {
          ...token,
          userId: user.id,
          email: currentUser.email,
          survey: currentUser.survey,
          accessTokenExpires: now + 60 * 60 * 1000, // 1h
        };
      }

      // when token is still valid
      if (now < (token.accessTokenExpires as number)) {
        return token;
      }

      // when token is not valid : refresh token if user still existing
      try {
        const refreshedUser = await db.user.findUnique({
          where: { email: token.email ?? undefined },
        });

        if (!refreshedUser) {
          console.warn("User not found during refresh, invalidating session.");
          return {};
        }

        return {
          ...token,
          accessTokenExpires: now + 60 * 60 * 1000,
        };
      } catch (err) {
        console.error("Error refreshing token:", err);
        return {};
      }
    },
    session: ({ session, token }) => {
      if (token.userId) {
        return {
          ...session,
          user: {
            ...session.user,
            ...token,
          },
        };
      }
      return {
        ...session,
        user: undefined,
      };
    },
  },
} satisfies NextAuthConfig;

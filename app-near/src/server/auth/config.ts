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

const tokenMaxAge = 60 * 60; // 1h

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

        if (!connexion.success || !connexion.user) {
          return null;
        }

        return connexion.user;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: tokenMaxAge },
  jwt: { maxAge: tokenMaxAge },

  callbacks: {
    /**
     * Determines whether a user is allowed to sign in and optionally returns an URL
     * for post-login redirection based on the user's role.
     * - Returns false if the user object is missing (prevents sign-in).
     * - Returns true to redirect the user after successful login.
     *
     * @param {Object} param0
     * @param {NextAuthUser} param0.user - The authenticated user object returned from the provider
     * @returns {boolean|string} false to block sign-in, or a URL string to redirect
     */
    async signIn({ user }) {
      if (!user) return false;

      return true;
    },
    /**
     * Callback to control where NextAuth redirects the user after sign-in, sign-out, or other auth events.
     * - Prevents returning to the login page after sign-in.
     * - Ensures the URL is internal to the site (security against open redirects).
     *
     * @param {Object} param0
     * @param {string} param0.url - The URL NextAuth intends to redirect to
     * @param {string} param0.baseUrl - The base URL of the site
     * @returns {string} The final URL to redirect the user to
     */
    async redirect({ url, baseUrl }) {
      // Prevent to get back to /connexion or to get external url
      if (url.includes("/connexion")) return baseUrl;
      if (!url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    /**
     * Callback called whenever a JWT token is created or updated.
     * - Adds custom properties to the token (e.g., roles, redirect URL).
     * - Used to persist user-related data across sessions without storing it in the DB.
     *
     * @param {Object} param0
     * @param {any} param0.token - The current JWT token
     * @param {NextAuthUser} param0.user - The user object returned on first login
     * @returns {any} The updated JWT token
     */
    async jwt({ token, user }) {
      const now = Date.now();

      // On first user login: generate token
      if (user) {
        const currentUser = user as NextAuthUser;
        return {
          ...token,
          userId: user.id,
          email: currentUser.email,
          survey: currentUser.survey,
          roles: currentUser.roles,
          accessTokenExpires: now + tokenMaxAge * 1000, // 1h
        };
      }

      // when token is still valid
      if (now < (token.accessTokenExpires as number)) {
        return token;
      }

      // when token is not valid anymore: refresh token if user still existing
      try {
        if (!token.email) {
          console.warn(
            "User email not found in token during refresh, invalidating session.",
          );
          return {};
        }

        const refreshedUser = await db.user.findUnique({
          where: { id: token.userId as number },
          include: { survey: true, roles: true },
        });

        if (!refreshedUser) {
          console.warn("User not found during refresh, invalidating session.");
          return {};
        }

        return {
          ...token,
          userId: refreshedUser.id,
          email: refreshedUser.email,
          survey: {
            id: refreshedUser.survey?.id,
            name: refreshedUser.survey?.name,
          },
          roles: refreshedUser.roles.map((role) => role.name),
          accessTokenExpires: now + tokenMaxAge * 1000,
        };
      } catch (err) {
        console.error("Error refreshing token:", err);
        return {};
      }
    },
    /**
     * Called whenever a session object is created or accessed (e.g., useSession, getServerSession).
     * - Maps relevant properties from the JWT token to the session object sent to the client.
     * - Makes user roles and redirect URL available in the session.
     *
     * @param {Object} param0
     * @param {any} param0.session - The current session object
     * @param {any} param0.token - The JWT token associated with the session
     * @returns {any} The updated session object
     */
    session: ({ session, token }) => {
      return {
        ...session,
        user: token.userId ? { ...session.user, ...token } : {},
      };
    },
  },
} satisfies NextAuthConfig;

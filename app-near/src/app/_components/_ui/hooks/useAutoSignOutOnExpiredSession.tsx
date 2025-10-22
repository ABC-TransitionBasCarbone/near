"use client";

import { useEffect } from "react";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useAutoSignOutOnExpiredSession = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.accessTokenExpires) {
      const now = Date.now();
      const expiresAt = session.user.accessTokenExpires;
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        void signOut({ callbackUrl: "/connexion" });
      } else {
        const timeout = setTimeout(() => {
          void signOut({ callbackUrl: "/connexion" });
        }, remaining);

        return () => clearTimeout(timeout);
      }
    }
  }, [session, status, router]);

  useEffect(() => {
    const id = setInterval(
      () => {
        void (async () => {
          await getSession();
        })();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(id);
  }, []);
};

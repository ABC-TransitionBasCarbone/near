import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./_components/_context/NotificationProvider";

export const metadata: Metadata = {
  title: {
    absolute: "Accueil | NEAR",
    template: "%s | NEAR",
    default: "NEAR",
  },
  description: "NEAR",
  icons: [{ rel: "icon", url: "/favicon.ico" }], // TODO: to change latter
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${GeistSans.variable}`}>
      <body>
        <TRPCReactProvider>
          <HydrateClient>
            <SessionProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </SessionProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";
import { HydrateClient } from "~/trpc/server";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: {
    absolute: 'Accueil | NEAR',
    template: '%s | NEAR',
    default: 'NEAR',
  },
  description: "NEAR",
  icons: [{ rel: "icon", url: "/favicon.ico" }], // to change latter
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
              {children}
            </SessionProvider>
          </HydrateClient>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

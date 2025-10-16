import { RoleName } from "@prisma/client";
import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignInForm from "~/app/_components/authentification/SignInForm";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez vous à NEAR",
};

export default async function SignIn(): Promise<JSX.Element> {
  const session = await auth();

  if (session?.user?.roles?.includes(RoleName.ADMIN)) {
    redirect("/back-office");
  } else if (session?.user) {
    redirect("/");
  }

  return (
    <Suspense fallback="Loading...">
      <SignInForm />
    </Suspense>
  );
}

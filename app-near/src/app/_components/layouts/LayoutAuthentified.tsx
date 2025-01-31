import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { auth } from "~/server/auth";
import SurveyHeader from "../survey/SurveyHeader";

interface LayoutAuthentifiedProps {
  children: ReactNode;
}

const LayoutAuthentified: React.FC<LayoutAuthentifiedProps> = async ({
  children,
}) => {
  const session: Session | null = await auth();

  if (!session?.user) {
    redirect(`${process.env.AUTH_URL}/connexion`);
  }

  return (
    <>
      <header>
        <SurveyHeader />
      </header>
      <main role="main">{children}</main>
      <footer>Footer</footer>
    </>
  );
};

export default LayoutAuthentified;

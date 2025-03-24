import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { auth, signOut } from "~/server/auth";
import SurveyHeader from "../survey/SurveyHeader";
import SurveyFooter from "../survey/SurveyFooter";

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

  if (!session.user.surveyName) {
    await signOut();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header>
        <SurveyHeader />
      </header>
      <main role="main" className="flex flex-1 flex-col">
        {children}
      </main>
      <footer>
        <SurveyFooter />
      </footer>
    </div>
  );
};

export default LayoutAuthentified;

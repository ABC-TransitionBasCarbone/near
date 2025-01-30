import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { auth } from "~/server/auth";
import SurveyHeader from "../survey/SurveyHeader";
import SurveyFooter from "../survey/SurveyFooter";

interface LayoutAuthentifiedProps {
  children: ReactNode;
}

const LayoutAuthentified: React.FC<LayoutAuthentifiedProps> = async ({
  children,
}) => {
  const session = await auth();

  if (!session?.user) {
    redirect("/connexion");
  }

  return (
    <>
      <header>
        <SurveyHeader />
      </header>
      <main role="main">{children}</main>
      <footer>
        <SurveyFooter />
      </footer>
    </>
  );
};

export default LayoutAuthentified;

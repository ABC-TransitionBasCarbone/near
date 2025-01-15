import { redirect } from "next/navigation";
import { type ReactNode } from "react";
import { auth } from "~/server/auth";

interface LayoutAuthentifiedProps {
  children: ReactNode;
}

const LayoutAuthentified: React.FC<LayoutAuthentifiedProps> = async ({
  children,
}) => {
  const session = await auth();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <>
      <header>Some header</header>
      <nav>Authentified Navigation</nav>
      <main>{children}</main>
      <footer>Footer</footer>
    </>
  );
};

export default LayoutAuthentified;

import { type RoleName } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

interface GrantAccessInterface {
  children: JSX.Element;
  allowedRoles: RoleName[];
}
export const GrantAccess: React.FC<GrantAccessInterface> = async ({
  children,
  allowedRoles,
}) => {
  const session = await auth();

  if (
    !session?.user ||
    !allowedRoles.some((allowedRole) =>
      session.user.roles.includes(allowedRole),
    )
  ) {
    redirect(`${process.env.AUTH_URL}/connexion`);
  }

  return children;
};

export default GrantAccess;

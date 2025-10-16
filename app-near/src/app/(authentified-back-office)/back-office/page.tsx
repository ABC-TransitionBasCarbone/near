import { type Session } from "next-auth";
import SignOutButton from "~/app/_components/authentification/SignOutButton";
import { auth } from "~/server/auth";

export default async function Home() {
  const session: Session | null = await auth();
  return (
    <>
      <div>you are an admin in secure page : {session?.user.email}</div>
      <div>
        <SignOutButton />
      </div>
    </>
  );
}

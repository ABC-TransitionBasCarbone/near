"use client";

import { signOut } from "next-auth/react";

const SignOutButton: React.FC = () => {
  return <button onClick={() => signOut()}>Se déconnecter</button>;
};

export default SignOutButton;

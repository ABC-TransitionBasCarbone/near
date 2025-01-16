"use client";

import { signOut, useSession } from "next-auth/react";
import React from "react";

const LandingPage: React.FC = () => {
  const { data: session } = useSession();
  return (
    <>
      <p>Authentified page with user {session?.user.email}</p>
      <button onClick={() => signOut()}>Se déconnecter</button>
    </>
  );
};

export default LandingPage;

"use client";

import { signOut, useSession } from "next-auth/react";
import {
  MetabaseIFrameNumber,
  MetabaseIframeType,
} from "~/types/enums/metabase";
import MetabaseIframe from "./_ui/MetabaseIframe";

const LandingPage: React.FC = () => {
  const { data: session } = useSession();

  return (
    <>
      <p>Authentified page with user {session?.user.email}</p>
      <button onClick={() => signOut()}>Se déconnecter</button>

      <MetabaseIframe
        iframeNumber={MetabaseIFrameNumber.POPULATION_STATISTICS}
        iframeType={MetabaseIframeType.DASHBOARD}
      />
    </>
  );
};

export default LandingPage;

import { useSession } from "next-auth/react";
import { api } from "../../../../../trpc/react";

const SuDashboard: React.FC = () => {
  const { data: session } = useSession();

  const { data: survey } = api.surveys.getOne.useQuery(undefined, {
    enabled: !!session?.user?.surveyId,
  });

  if (!survey?.computedSu) {
    return null;
  }

  return <></>;
};

export default SuDashboard;

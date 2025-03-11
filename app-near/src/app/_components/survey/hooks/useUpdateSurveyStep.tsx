import { api } from "~/trpc/react";
import { useSurveyStateContext } from "../../_context/surveyStateContext";
import { useSession } from "next-auth/react";
import { type SurveyPhase } from "@prisma/client";

const useUpdateSurveyStep = () => {
  const utils = api.useUtils();
  const { data: session } = useSession();
  const { updateStep } = useSurveyStateContext();
  const updateSurveyMutation = api.surveys.update.useMutation();

  const updateSurveyStep = async (nextStep?: SurveyPhase) => {
    if (!nextStep || !session) return;

    updateStep(nextStep);

    await updateSurveyMutation.mutateAsync({
      surveyId: session?.user?.surveyId,
      data: { phase: nextStep },
    });

    await utils.surveys.getOne.invalidate();
  };

  return updateSurveyStep;
};

export default useUpdateSurveyStep;

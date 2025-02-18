import { api } from "~/trpc/react";
import { useSurveyStateContext } from "../../_context/surveyStateContext";
import { type SurveyStep } from "~/types/enums/surveyStep";
import { useSession } from "next-auth/react";

const useUpdateSurveyStep = () => {
  const { data: session } = useSession();
  const { updateStep } = useSurveyStateContext();
  const updateSurveyMutation = api.surveys.update.useMutation();

  const updateSurveyStep = async (nextStep?: SurveyStep) => {
    if (!nextStep || !session) return;

    updateStep(nextStep);

    await updateSurveyMutation.mutateAsync({
      surveyId: session?.user?.surveyId,
      data: { phase: nextStep },
    });
  };

  return updateSurveyStep;
};

export default useUpdateSurveyStep;

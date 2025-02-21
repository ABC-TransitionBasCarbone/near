import { computeSus } from "~/server/external-api/api-su";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { type SuAnswerData } from "~/types/SuDetection";
import { updateAfterSUDetection } from "~/server/su/answers/update";
import { saveSuData } from "~/server/su/data/save";
import { updateSurvey } from "~/server/surveys/put";

export const suDetectionRouter = createTRPCRouter({
  run: protectedProcedure.mutation(async ({ ctx }) => {
    const { surveyId } = ctx.session.user;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    console.log("Detect SU for", surveyId);

    const suAnswerData: SuAnswerData[] = [];

    const response = await computeSus(suAnswerData);

    const suNames = await saveSuData(surveyId, response.computedSus);

    await updateAfterSUDetection(response.answerAttributedSu);

    //
    await updateSurvey(surveyId, { computedSu: true });

    return suNames;
  }),
});

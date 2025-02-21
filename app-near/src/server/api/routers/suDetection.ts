import { computeSus } from "~/server/external-api/api-su";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  type SuAnswerData,
  type SuComputationResponse,
} from "~/types/SuDetection";

export const suDetectionRouter = createTRPCRouter({
  run: protectedProcedure.mutation(async ({ ctx }) => {
    const { surveyId } = ctx.session.user;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    console.log("Detect SU for", surveyId);

    const suAnswerData: SuAnswerData[] = [];
    // getSuAnswer
    const suComputationResponse: SuComputationResponse =
      computeSus(suAnswerData);
    // updateSuAnswer
    // createSu
    // updateSurvey
    return null; // TODO NEAR-30
  }),
});

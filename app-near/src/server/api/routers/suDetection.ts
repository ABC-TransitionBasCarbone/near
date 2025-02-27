import {
  buildSuComputationRequest,
  computeSus,
  verifyStep,
} from "~/server/external-api/api-su";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { updateAfterSUDetection } from "~/server/su/answers/update";
import { saveSuData } from "~/server/su/data/save";
import { updateSurvey } from "~/server/surveys/put";
import { db } from "~/server/db";

export const suDetectionRouter = createTRPCRouter({
  run: protectedProcedure.mutation(async ({ ctx }) => {
    const { surveyId } = ctx.session.user;
    if (!surveyId) {
      throw new TRPCError({ code: "FORBIDDEN" });
    }

    await verifyStep(surveyId);

    const request = await buildSuComputationRequest(surveyId);
    if (request.length === 0) {
      return [];
    }

    const response = await computeSus(request);

    return await db.$transaction(async () => {
      const suNames = await saveSuData(surveyId, response.computedSus);

      await updateAfterSUDetection(response.answerAttributedSu);

      await updateSurvey(surveyId, { computedSu: true });

      return suNames;
    });
  }),
});

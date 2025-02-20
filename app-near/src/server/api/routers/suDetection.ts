import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { saveSuData } from "~/server/su/put";

export const suDataRouter = createTRPCRouter({
  detectSu: protectedProcedure
    .input(
      z.object({
        surveyId: z.number(),
        computedSus: z.array(
          z.object({
            su: z.number(),
            barycenter: z.array(z.number()),
            popPercentage: z.number(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { surveyId, computedSus } = input;

      return saveSuData(surveyId, computedSus);
    }),
});

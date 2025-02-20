import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { updateSuAnswer } from "~/server/su/put";

export const suAnswerRouter = createTRPCRouter({
  updateSuAnswer: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.number(),
          su: z.number(),
          distanceToBarycenter: z.number(),
        }),
      ),
    )
    .mutation(async ({ input }) => {
      return updateSuAnswer(input);
    }),
});

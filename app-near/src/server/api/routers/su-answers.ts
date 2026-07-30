import { createTRPCRouter, surveyProtectedProcedure } from "../trpc";
import { countAnswers } from "../../su/answers/count";
import representativenessService from "../../su/answers/representativeness";
import { sendUsersSu } from "~/server/su/sendUsersSu";
import { countBySu } from "~/server/su/data/count";

export const suAnswersRouter = createTRPCRouter({
  count: surveyProtectedProcedure.query(({ ctx }) => {
    return countAnswers(ctx.session.user.survey.id);
  }),
  representativeness: surveyProtectedProcedure.query(async ({ ctx }) => {
    return representativenessService.representativeness(
      ctx.session.user.survey.id,
    );
  }),
  sendSu: surveyProtectedProcedure.mutation(({ ctx }) => {
    return sendUsersSu(ctx.session.user.survey.id);
  }),
  countBySu: surveyProtectedProcedure.query(async ({ ctx }) => {
    return countBySu(ctx.session.user.survey.id);
  }),
});

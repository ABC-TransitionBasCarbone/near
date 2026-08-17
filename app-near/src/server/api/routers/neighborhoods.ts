import { createTRPCRouter, surveyProtectedProcedure } from "../trpc";
import { getOneNeighborhood } from "~/server/neighborhoods/get";

export const neighborhoodsRouter = createTRPCRouter({
  getOne: surveyProtectedProcedure.query(({ ctx }) => {
    return getOneNeighborhood(ctx.session.user.survey.id);
  }),
});

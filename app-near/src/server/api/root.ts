import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { metabaseRouter } from "./routers/metabase";
import { neighborhoodsRouter } from "./routers/neighborhoods";
import { surveysRouter } from "./routers/surveys";
import { suDetectionRouter } from "./routers/suDetection";
import { suAnswersRouter } from "./routers/su-answers";
import { wayOfLifeAnswersRouter } from "./routers/way-of-life-answers";
import { carbonFootprintAnswersRouter } from "./routers/carbon-footprint-answers";
import { analyzesRouter } from "./routers/analyzez";
import { irisRouter } from "./routers/iris";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  metabase: metabaseRouter,
  neighborhoods: neighborhoodsRouter,
  surveys: surveysRouter,
  suDetection: suDetectionRouter,
  suAnswers: suAnswersRouter,
  wayOfLifeAnswers: wayOfLifeAnswersRouter,
  carbonFootprintAnswers: carbonFootprintAnswersRouter,
  analyzes: analyzesRouter,
  iris: irisRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

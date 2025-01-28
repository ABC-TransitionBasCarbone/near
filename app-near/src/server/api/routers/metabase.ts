import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { MetabaseIframeType } from "~/types/enums/metabase";
import { getMetabaseIFrameUrl } from "~/server/metabase/token";
import { TRPCError } from "@trpc/server";

export const metabaseRouter = createTRPCRouter({
  getIframeUrl: publicProcedure
    .input(
      z.object({
        iframeNumber: z.number(),
        iframeType: z.nativeEnum(MetabaseIframeType),
        params: z.record(z.any()).optional(),
      }),
    )
    .query(({ ctx, input }) => {
      if (!ctx.session?.user.email) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const { iframeNumber, iframeType, ...params } = input;
      return getMetabaseIFrameUrl(iframeNumber, iframeType, params);
    }),
});

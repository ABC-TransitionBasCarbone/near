import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { MetabaseIframeType } from "~/types/enums/metabase";
import { getMetabaseIFrameUrl } from "~/server/metabase/token";

export const metabaseRouter = createTRPCRouter({
  getIframeUrl: protectedProcedure
    .input(
      z.object({
        iframeNumber: z.number(),
        iframeType: z.nativeEnum(MetabaseIframeType),
        params: z.record(z.any()).optional(),
        bordered: z.boolean().optional(),
        title: z.boolean().optional(),
      }),
    )
    .query(({ input }) => {
      const { iframeNumber, iframeType, bordered, title, params } = input;
      return getMetabaseIFrameUrl(
        iframeNumber,
        iframeType,
        params,
        bordered,
        title,
      );
    }),
});

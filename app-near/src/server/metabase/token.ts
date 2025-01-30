import { env } from "~/env";
import { type MetabaseIframeType } from "~/types/enums/metabase";
import jwt from "jsonwebtoken";

export const getMetabaseIFrameUrl = (
  iframeNumber: number,
  iframeType: MetabaseIframeType,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any> = {},
  bordered = false,
  title = false,
): string => {
  // Code below is a copy paste from:
  // https://near-metabase.osc-fr1.scalingo.io/dashboard/2-sus?date=past1months&tab=4-su1
  // Partager et embarquer -> Encastrement statique
  const payload = {
    resource: { [iframeType]: iframeNumber },
    params,
    exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
  };

  const token = jwt.sign(payload, env.METABASE_SECRET_KEY, {
    algorithm: "HS256",
  });
  const iframeUrl = `${env.METABASE_SITE_URL}/embed/${iframeType}/${token}#bordered=${bordered}&titled=${title}`;
  return iframeUrl;
};

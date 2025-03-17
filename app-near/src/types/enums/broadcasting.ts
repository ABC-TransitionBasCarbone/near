import { env } from "~/env";
import { SurveyType } from "./survey";

export type BroadcastType =
  | "mail_campaign"
  | "social_network"
  | "street_survey"
  | "qr_code";

export const surveyTypeMapper: Record<
  SurveyType,
  { label: string; stat?: string; baseUrl: string }
> = {
  [SurveyType.CARBON_FOOTPRINT]: {
    label: "Empreinte Carbone (Nos Gestes Climats)",
    baseUrl: env.NEXT_PUBLIC_TYPEFORM_CARBON_FOOTPRINT_LINK,
  },
  [SurveyType.WAY_OF_LIFE]: {
    label: "Espace et Mode de Vie",
    stat: env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_STAT,
    baseUrl: env.NEXT_PUBLIC_TYPEFORM_WAY_OF_LIFE_LINK,
  },
  [SurveyType.SU]: {
    label: "Sphère d'usage",
    stat: env.NEXT_PUBLIC_TYPEFORM_SU_STATS,
    baseUrl: env.NEXT_PUBLIC_TYPEFORM_SU_LINK,
  },
};

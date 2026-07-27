import { env } from "~/env";
import { SurveyType } from "./survey";

export enum BroadcastType {
  MAIL_CAMPAIGN = "mail_campaign",
  SOCIAL_NETWORK = "social_network",
  STREET_SURVEY = "street_survey",
  QR_CODE = "qr_code",
}

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
    baseUrl: env.NEXT_PUBLIC_TYPEFORM_SU_LINK,
  },
};

import { TemplateId } from "~/types/enums/brevo";
import EmailService from "../email";
import { buildSurveyLink } from "~/server/surveyLinks/build";
import { SurveyType } from "~/types/enums/survey";
import { BroadcastType } from "~/types/enums/broadcasting";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

export const sendPhaseTwoFormNotification = async (
  surveyId: number,
  email: string,
  surveyName: string,
  suName: number | undefined,
  options: {
    displayWayOfLife: "true" | "false";
    displayCarbonFootprint: "true" | "false";
  },
) => {
  if (!suName) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.SU_NOT_FOUND,
    });
  }

  return EmailService.sendEmail({
    to: [{ email }],
    params: {
      ...options,
      neighborhood: surveyName,
      suName: suName.toString(),
      wayOfLifeUrl: await buildSurveyLink(
        surveyId,
        BroadcastType.MAIL_CAMPAIGN,
        SurveyType.WAY_OF_LIFE,
        surveyName,
      ),
      ngcUrl: await buildSurveyLink(
        surveyId,
        BroadcastType.MAIL_CAMPAIGN,
        SurveyType.CARBON_FOOTPRINT,
        surveyName,
      ),
    },
    templateId: TemplateId.PHASE_2_NOTIFICATION,
    subject: `Petite enquête ${surveyName} : merci d'avoir répondu ! Et la suite ?`,
  });
};

import { TemplateId } from "~/types/enums/brevo";
import EmailService from "../email";
import { getWayOfLifeAnswerByEmail } from "../way-of-life/get";
import { getCarbonFootprintAnswerByEmail } from "../carbon-footprint/get";
import { buildSurveyLink } from "~/shared/services/survey-links/build";
import { SurveyType } from "~/types/enums/survey";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";

export const sendPhaseTwoFormNotification = async (
  email: string,
  surveyName: string,
  suName?: number,
) => {
  if (!suName) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: ErrorCode.SU_NOT_FOUND,
    });
  }

  const wayOfLifeAnswer = await getWayOfLifeAnswerByEmail(email);
  const carbonFootprintAnswer = await getCarbonFootprintAnswerByEmail(email);

  return EmailService.sendEmail({
    to: [{ email }],
    params: {
      displayWayOfLife: wayOfLifeAnswer ? "false" : "true",
      displayCarbonFootprint: carbonFootprintAnswer ? "false" : "true",
      neighborhood: surveyName,
      suName: suName.toString(),
      wayOfLifeUrl: buildSurveyLink(
        "mail_campaign",
        SurveyType.WAY_OF_LIFE,
        surveyName,
      ),
      ngcUrl: buildSurveyLink(
        "mail_campaign",
        SurveyType.CARBON_FOOTPRINT,
        surveyName,
      ),
    },
    templateId: TemplateId.PHASE_2_NOTIFICATION,
    subject: `Petite enquête ${surveyName} : merci d'avoir répondu ! Et la suite ?`,
  });
};

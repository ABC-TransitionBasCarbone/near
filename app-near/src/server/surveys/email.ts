import { TemplateId } from "~/types/enums/brevo";
import EmailService from "../email";
import { getWayOfLifeAnswerByEmail } from "../way-of-life/get";
import { getCarbonFootprintAnswerByEmail } from "../carbon-footprint/get";
import { buildSurveyLink } from "~/shared/services/survey-links/build";
import { SurveyType } from "~/types/enums/survey";

export const sendPhaseTwoFormNotification = async (
  email: string,
  surveyName: string,
  suName?: number,
) => {
  const wayOfLifeAnswer = await getWayOfLifeAnswerByEmail(email);
  const carbonFootprintAnswer = await getCarbonFootprintAnswerByEmail(email);

  return EmailService.sendEmail({
    to: [{ email }],
    params: {
      displayWayOfLife: wayOfLifeAnswer ? "false" : "true",
      displayCarbonFootprint: carbonFootprintAnswer ? "false" : "true",
      suName: suName?.toString() ?? "",
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
  });
};

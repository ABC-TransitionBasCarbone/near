import { TemplateId } from "~/types/enums/brevo";
import EmailService from "../email";
import { getWayOfLifeAnswerByEmail } from "../way-of-life/get";
import { getCarbonFootprintAnswerByEmail } from "../carbon-footprint/get";

export const sendPhaseTwoFormNotification = async (email: string) => {
  const wayOfLifeAnswer = await getWayOfLifeAnswerByEmail(email);
  const carbonFootprintAnswer = await getCarbonFootprintAnswerByEmail(email);

  return EmailService.sendEmail({
    to: [{ email }],
    params: {
      displayWayOfLife: wayOfLifeAnswer ? "false" : "true",
      displayCarbonFootprint: carbonFootprintAnswer ? "false" : "true",
    },
    templateId: TemplateId.PHASE_2_NOTIFICATION,
  });
};

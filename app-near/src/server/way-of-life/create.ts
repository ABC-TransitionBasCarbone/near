import { type Survey, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "../db";
import { getNeighborhoodSuDataToAssign } from "../su/get";
import apiSuService from "../external-api/api-su";
import { convertToSuAnswerData } from "../external-api/convert";
import { sendPhaseTwoFormNotification } from "../surveys/email";

export const handleWayOfLifeCreation = async (
  data: WayOfLifeAnswer,
  survey: Survey,
) => {
  let calculatedSu = {};

  if (!data.knowSu) {
    const suData = await getNeighborhoodSuDataToAssign(survey.name);

    const result = await apiSuService.assignSu({
      sus: suData,
      userData: convertToSuAnswerData({
        airTravelFrequency: data.airTravelFrequency!,
        digitalIntensity: data.digitalIntensity!,
        heatSource: data.heatSource!,
        meatFrequency: data.meatFrequency!,
        purchasingStrategy: data.purchasingStrategy!,
        transportationMode: data.transportationMode!,
      }),
    });

    const su = await db.suData.findUnique({
      where: { surveyId_su: { surveyId: survey.id, su: result.su } },
    });

    calculatedSu = {
      suId: su?.id,
      distanceToBarycenter: result.distanceToBarycenter,
    };
  }

  await createWayOfLifeAnswer(
    {
      ...data,
      ...calculatedSu,
    } as WayOfLifeAnswer,
    survey.name,
  );

  if (data.email) {
    await sendPhaseTwoFormNotification(data.email);
  }
};

const createWayOfLifeAnswer = async (
  answer: WayOfLifeAnswer,
  surveyName: string,
) => {
  const survey = await db.survey.findFirst({ where: { name: surveyName } });
  if (!survey) {
    throw new Error("survey not found");
  }

  return db.wayOfLifeAnswer.create({
    data: { ...answer, surveyId: survey.id },
  });
};

import { type Survey, type WayOfLifeAnswer } from "@prisma/client";
import { db } from "../db";
import { getNeighborhoodSuDataToAssignOrThrows } from "../su/get";
import apiSuService from "../external-api/api-su";
import { convertToSuAnswerData } from "../external-api/convert";
import { sendPhaseTwoFormNotification } from "../surveys/email";
import { suAssignementRequestValidation } from "~/types/SuDetection";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { type BuilderWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

export const handleWayOfLifeCreation = async (
  data: BuilderWayOfLifeAnswer,
  survey: Survey,
) => {
  let calculatedSu = {};

  if (!data.knowSu) {
    const suData = await getNeighborhoodSuDataToAssignOrThrows(survey.name);

    // could throw error if schema is not valid
    const payload = suAssignementRequestValidation.parse({
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

    const result = await apiSuService.assignSu(payload);

    const su = await db.suData.findUnique({
      where: { surveyId_su: { surveyId: survey.id, su: result.su } },
    });

    if (!su) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: ErrorCode.SU_NOT_FOUND,
      });
    }

    calculatedSu = {
      suId: su.id,
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

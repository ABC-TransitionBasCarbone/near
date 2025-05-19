import { TemplateId } from "~/types/enums/brevo";
import { db } from "../db";
import EmailService from "../email";
import { SurveyPhase } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { chunkArray } from "../utils/arrays";
import { buildSurveyLink } from "~/shared/services/survey-links/build";
import { SurveyType } from "~/types/enums/survey";

interface Result {
  status: "fulfilled" | "rejected";
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  value: string | unknown;
}
export const sendUsersSu = async (surveyId: number): Promise<Result[]> => {
  const survey = await db.survey.findUnique({ where: { id: surveyId } });

  if (!survey || survey.phase !== SurveyPhase.STEP_3_SU_EXPLORATION) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.MISSING_SURVEY_PHASE,
    });
  }

  if (!survey.computedSu) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: ErrorCode.SU_NOT_COMPUTED,
    });
  }

  const answers = await db.suAnswer.findMany({
    where: { surveyId, email: { not: null }, su: { su: { not: undefined } } },
    select: { id: true, email: true, su: true },
  });

  const results: Result[] = [];

  const chunkedAnswers = chunkArray(answers, 800);

  for (const chunk of chunkedAnswers) {
    try {
      const result = await EmailService.sendEmail({
        templateId: TemplateId.SU_RESULT,
        messageVersions: chunk.map((item) => ({
          params: {
            suName: `${item.su!.su}`,
            neighborhood: survey.name,
            numberOfResponses: answers.length.toString(),
            wayOfLifeUrl: buildSurveyLink(
              "mail_campaign",
              SurveyType.WAY_OF_LIFE,
              survey.name,
            ),
            ngcUrl: buildSurveyLink(
              "mail_campaign",
              SurveyType.CARBON_FOOTPRINT,
              survey.name,
            ),
          },
          to: [{ email: item.email! }],
          subject: `Petite enquête ${survey.name} : merci d'avoir répondu ! Et la suite ?`,
        })),
      });

      await db.suAnswer.updateMany({
        data: { emailApiCalled: true },
        where: {
          email: {
            in: chunk.map((item) => item.email!).filter((email) => email),
          },
        },
      });
      results.push({ status: "fulfilled", value: result });
    } catch (error) {
      results.push({ status: "rejected", value: error });
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  const errors = results.filter((result) => result.status === "rejected");

  if (errors.length) {
    errors.forEach((error) => console.error(error));
  }

  return results;
};

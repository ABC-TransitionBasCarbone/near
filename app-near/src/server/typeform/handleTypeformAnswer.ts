import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  TypeformType,
  type TypeformWebhookPayload,
  TypeformWebhookSchema,
} from "~/types/Typeform";
import { getReferencesMapping } from "../surveys/references";
import { convertFormToAnswer } from "./convert";
import { isValidSignature, SignatureType } from "./signature";
import { typeformSchemaMapper } from "./schema";
import { type ConvertedSuAnswer } from "~/types/SuAnswer";
import { type ConvertedWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";
import {
  getFormIdType,
  getSurveyInformations,
  getValidSurveyPhase,
  isNotInPhase,
  isNotPartOfNeighborhood,
  isUnder15,
  notInPhaseSuSurveyResponse,
  okResponse,
} from "./helpers";
import { createSu } from "../su/answers/create";
import { type SuAnswer, type WayOfLifeAnswer } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { ErrorCode } from "~/types/enums/error";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { handleWayOfLifeCreation } from "../way-of-life/create";
import { getCalculatedSuParams } from "../su/get";

export const handleTypeformAnswer = async (
  req: NextRequest,
): Promise<NextResponse> => {
  let formId: string | undefined = undefined;
  let webhookId: string | undefined = undefined;

  try {
    const body = await req.text();
    const parsedBody: TypeformWebhookPayload = TypeformWebhookSchema.parse(
      JSON.parse(body),
    );
    formId = parsedBody.form_response.form_id;
    webhookId = parsedBody.event_id;
    const typeformType = getFormIdType(formId);

    console.debug("[whebhook]", typeformType, body);

    if (!isValidSignature(req, body, SignatureType.TYPEFORM)) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ErrorCode.WRONG_SIGNATURE,
      });
    }

    const referencesMapping = getReferencesMapping(typeformType);

    const answers = convertFormToAnswer(parsedBody, referencesMapping);
    console.debug("[whebhook]", typeformType, JSON.stringify(answers));

    if (isNotPartOfNeighborhood(answers)) {
      return okResponse("user should live in neighborhood");
    }

    if (isUnder15(answers)) {
      return okResponse("user should be under 15");
    }

    // could throw zod exception from zod parsing
    const parsedAnswer = typeformSchemaMapper[typeformType].parse(answers) as
      | ConvertedSuAnswer
      | ConvertedWayOfLifeAnswer;

    // remove isNeighborhoodResident property before save
    // @ts-expect-error remove su name
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { isNeighborhoodResident, su, ...createQuery } = parsedAnswer;

    const { surveyName, survey } = await getSurveyInformations(
      parsedBody.form_response.hidden.neighborhood,
      typeformType,
    );

    const validPhase = getValidSurveyPhase(typeformType);
    if (isNotInPhase(survey, validPhase)) {
      return notInPhaseSuSurveyResponse(surveyName, validPhase);
    }

    const broadcastChannel = parsedBody.form_response.hidden.broadcast_channel;

    if (typeformType === TypeformType.SU) {
      await createSu(
        { ...createQuery, broadcastChannel } as SuAnswer,
        surveyName,
      );
    } else if (typeformType === TypeformType.WAY_OF_LIFE) {
      const calculatedSuParams = await getCalculatedSuParams(
        survey,
        parsedAnswer as ConvertedWayOfLifeAnswer,
      );

      await handleWayOfLifeCreation(
        {
          ...createQuery,
          broadcastChannel,
          ...calculatedSuParams,
        } as WayOfLifeAnswer,
        survey,
      );
    }

    return NextResponse.json({ message: "created" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(
        "[whebhook]",
        formId,
        webhookId,
        "ZOD ERROR :",
        error.errors,
      );
      return NextResponse.json(
        { error: "Invalid payload", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof TRPCError) {
      return new NextResponse(
        JSON.stringify({
          code: error.code,
          message: error.message,
          data: error.cause ?? null,
        }),
        { status: getHTTPStatusCodeFromError(error) },
      );
    }

    if (error instanceof Error) {
      console.error("[whebhook]", formId, webhookId, "ERROR :", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.error("[whebhook]", formId, webhookId, "UNKNOWN ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

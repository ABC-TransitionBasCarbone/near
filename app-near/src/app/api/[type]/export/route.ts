import { auth } from "~/server/auth";
import { buildCSVFromCarbonFootprintAnswers } from "~/server/carbon-footprint/export";
import { buildCSVFromSUAnswers } from "~/server/su/answers/export";
import { buildCSVFromWayOfLifeAnswers } from "~/server/way-of-life/export";
import { AnswerType } from "~/types/enums/AnswerType";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> },
) {
  const session = await auth();
  const surveyId = session?.user.survey?.id;

  if (!surveyId) {
    return new Response(null, { status: 403 });
  }

  const type = (await params).type as AnswerType;

  let csv = "";

  switch (type) {
    case AnswerType.SU:
      csv = await buildCSVFromSUAnswers(surveyId);
      break;
    case AnswerType.CARBON_FOOTPRINT:
      csv = await buildCSVFromCarbonFootprintAnswers(surveyId);
      break;
    case AnswerType.WAY_OF_LIFE:
      csv = await buildCSVFromWayOfLifeAnswers(surveyId);
    default:
      break;
  }

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="export-${type}-${surveyId}.csv"`,
    },
  });
}

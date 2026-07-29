import { auth } from "~/server/auth";
import { buildCSVFromSUAnswers } from "~/server/su/answers/export";

export async function GET() {
  const session = await auth();
  const surveyId = session?.user.survey?.id;

  if (!surveyId) {
    return new Response(null, { status: 403 });
  }

  const csv = await buildCSVFromSUAnswers(surveyId);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="export-su-${surveyId}.csv"`,
    },
  });
}

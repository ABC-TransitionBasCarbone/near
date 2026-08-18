import { AnswerErrorStatus, AnswerType } from "@prisma/client";
import { createAnswerError } from "~/server/anwser-error/create";
import { recordAnswerErrorAttempt } from "~/server/anwser-error/recordAttempt";
import { db } from "~/server/db";
import { clearAlldata } from "~/server/test-utils/clear";
import { createNeighborhood } from "~/server/test-utils/create-data/neighborhood";
import { valideSuSurveyPayload } from "~/server/test-utils/suSurvey";
import { getValidSurveyPhase } from "~/server/typeform/helpers";
import { TypeformType } from "~/types/Typeform";
import { replay, selectRowsToReplay } from "./replay";

describe("selectRowsToReplay", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  it("throws when none of id, all=true or surveyName is provided", async () => {
    await expect(selectRowsToReplay({})).rejects.toThrow(
      "Verify usage command: id, all=true or surveyName is missing",
    );
  });

  it("throws with the list of valid survey names when surveyName does not match any survey", async () => {
    await createNeighborhood("Martin Luther King");
    await createNeighborhood("Porte d'Orléans");

    await expect(
      selectRowsToReplay({ surveyName: "Unknown neighborhood" }),
    ).rejects.toThrow(
      'Survey "Unknown neighborhood" not found. Valid survey names: Martin Luther King, Porte d\'Orléans',
    );
  });

  it("only returns the errors belonging to the requested survey", async () => {
    await createNeighborhood("Martin Luther King");
    await createNeighborhood("Porte d'Orléans");

    const suError = await createAnswerError(
      { form_response: { hidden: { neighborhood: "Martin Luther King" } } },
      AnswerType.SU,
    );
    const carbonFootprintError = await createAnswerError(
      { neighborhoodId: "Martin Luther King" },
      AnswerType.CARBON_FOOTPRINT,
    );
    await createAnswerError(
      { form_response: { hidden: { neighborhood: "Porte d'Orléans" } } },
      AnswerType.SU,
    );

    const rows = await selectRowsToReplay({
      surveyName: "Martin Luther King",
    });

    expect(rows.map((row) => row.id)).toEqual([
      suError.id,
      carbonFootprintError.id,
    ]);
  });

  it("combines surveyName with a type filter", async () => {
    await createNeighborhood("Martin Luther King");

    const suError = await createAnswerError(
      { form_response: { hidden: { neighborhood: "Martin Luther King" } } },
      AnswerType.SU,
    );
    await createAnswerError(
      { neighborhoodId: "Martin Luther King" },
      AnswerType.CARBON_FOOTPRINT,
    );

    const rows = await selectRowsToReplay({
      surveyName: "Martin Luther King",
      type: AnswerType.SU,
    });

    expect(rows.map((row) => row.id)).toEqual([suError.id]);
  });

  it("ignores resolved errors even when all=true", async () => {
    const active = await createAnswerError({ id: 1 }, AnswerType.SU);
    const resolved = await createAnswerError({ id: 2 }, AnswerType.SU);
    await recordAnswerErrorAttempt(resolved.id, { success: true });

    const rows = await selectRowsToReplay({ all: "true" });

    expect(rows.map((row) => row.id)).toEqual([active.id]);
  });
});

describe("replay", () => {
  const neighborhoodName = "name"; // matches valideSuSurveyPayload's hidden.neighborhood

  beforeEach(async () => {
    await clearAlldata();
  });

  it("resolves the error and creates the SU answer when the replay succeeds", async () => {
    const survey = await db.survey.create({
      data: {
        name: neighborhoodName,
        phase: getValidSurveyPhase(TypeformType.SU),
      },
    });

    const errorRow = await createAnswerError(
      valideSuSurveyPayload,
      AnswerType.SU,
      "initial failure",
    );

    await replay({ surveyName: neighborhoodName });

    const updated = await db.rawAnswerError.findUniqueOrThrow({
      where: { id: errorRow.id },
    });
    expect(updated.status).toBe(AnswerErrorStatus.RESOLVED);
    expect(updated.retryCount).toBe(1);
    expect(updated.resolvedAt).not.toBeNull();
    expect(updated.errorMessage).toBeNull();

    const suAnswer = await db.suAnswer.findFirst({
      where: { surveyId: survey.id },
    });
    expect(suAnswer).not.toBeNull();
    expect(suAnswer?.typeformId).toBe(
      valideSuSurveyPayload.form_response.token,
    );
  });

  it("keeps the error active and stores the new error message when the replay still fails", async () => {
    const errorRow = await createAnswerError(
      {},
      AnswerType.CARBON_FOOTPRINT,
      "initial failure",
    );

    await replay({ id: String(errorRow.id) });

    const updated = await db.rawAnswerError.findUniqueOrThrow({
      where: { id: errorRow.id },
    });
    expect(updated.status).toBe(AnswerErrorStatus.ACTIVE);
    expect(updated.retryCount).toBe(1);
    expect(updated.errorMessage).toBeTruthy();
    expect(updated.errorMessage).not.toBe("initial failure");
  });
});

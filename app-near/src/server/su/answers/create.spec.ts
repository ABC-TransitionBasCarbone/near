import { type Survey, type SuAnswer } from "@prisma/client";
import { db } from "../../db";
import { buildSuAnswer } from "../../test-utils/create-data/suAnswer";
import { clearAlldata } from "../../test-utils/clear";
import { createSu } from "./create";

describe("createSu", () => {
  const neighborhoodName = "neighborhood_test";
  let survey: Survey;

  beforeEach(async () => {
    await clearAlldata();
    survey = await db.survey.create({ data: { name: neighborhoodName } });
  });

  it("should create a SuAnswer", async () => {
    await createSu(
      buildSuAnswer(survey.id, { typeformId: "typeform-1" }) as SuAnswer,
      neighborhoodName,
    );

    const data = await db.suAnswer.findMany();
    expect(data.length).toBe(1);
  });

  it("should not create a duplicate when replayed with the same typeformId", async () => {
    const answer = buildSuAnswer(survey.id, {
      typeformId: "typeform-1",
    }) as SuAnswer;

    const first = await createSu(answer, neighborhoodName);
    const second = await createSu(answer, neighborhoodName);

    expect(second.id).toBe(first.id);

    const data = await db.suAnswer.findMany();
    expect(data.length).toBe(1);
  });

  it("should refuse to create a SuAnswer with the default 'unknown' typeformId", async () => {
    await expect(
      createSu(
        buildSuAnswer(survey.id, { typeformId: "unknown" }) as SuAnswer,
        neighborhoodName,
      ),
    ).rejects.toThrow("missing typeformId");

    const data = await db.suAnswer.findMany();
    expect(data.length).toBe(0);
  });
});

import { AnswerType } from "@prisma/client";
import { clearAlldata } from "../test-utils/clear";
import { createAnswerError } from "./create";
import { listActiveAnswerErrors } from "./list";
import { recordAnswerErrorAttempt } from "./recordAttempt";

describe("listActiveAnswerErrors", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  it("should only return active errors", async () => {
    const active = await createAnswerError({ id: 1 }, AnswerType.SU);
    const resolved = await createAnswerError({ id: 2 }, AnswerType.SU);
    await recordAnswerErrorAttempt(resolved.id, { success: true });

    const errors = await listActiveAnswerErrors();

    expect(errors.map((error) => error.id)).toEqual([active.id]);
  });

  it("should filter by answer type when provided", async () => {
    await createAnswerError({ id: 1 }, AnswerType.SU);
    const wayOfLife = await createAnswerError(
      { id: 2 },
      AnswerType.WAY_OF_LIFE,
    );

    const errors = await listActiveAnswerErrors(AnswerType.WAY_OF_LIFE);

    expect(errors.map((error) => error.id)).toEqual([wayOfLife.id]);
  });
});

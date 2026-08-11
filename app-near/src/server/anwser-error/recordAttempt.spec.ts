import { AnswerErrorStatus, AnswerType } from "@prisma/client";
import { db } from "../db";
import { clearAlldata } from "../test-utils/clear";
import { createAnswerError } from "./create";
import { recordAnswerErrorAttempt } from "./recordAttempt";

describe("recordAnswerErrorAttempt", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  it("should mark the error resolved and clear the message on success", async () => {
    const error = await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "first failure",
    );

    await recordAnswerErrorAttempt(error.id, { success: true });

    const updated = await db.rawAnswerError.findUniqueOrThrow({
      where: { id: error.id },
    });

    expect(updated.status).toBe(AnswerErrorStatus.RESOLVED);
    expect(updated.errorMessage).toBeNull();
    expect(updated.retryCount).toBe(1);
    expect(updated.resolvedAt).not.toBeNull();
  });

  it("should keep the error active and update the message on failure", async () => {
    const error = await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "first failure",
    );

    await recordAnswerErrorAttempt(error.id, {
      success: false,
      errorMessage: "still failing",
    });

    const updated = await db.rawAnswerError.findUniqueOrThrow({
      where: { id: error.id },
    });

    expect(updated.status).toBe(AnswerErrorStatus.ACTIVE);
    expect(updated.errorMessage).toBe("still failing");
    expect(updated.retryCount).toBe(1);
    expect(updated.resolvedAt).toBeNull();
  });
});

import { AnswerErrorStatus, AnswerType } from "@prisma/client";
import { db } from "../db";
import { clearAlldata } from "../test-utils/clear";
import { createAnswerError } from "./create";
import { recordAnswerErrorAttempt } from "./recordAttempt";

describe("createAnswerError", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  it("should save the raw payload with an active status and the error message", async () => {
    const rawPayload = { foo: "bar" };

    await createAnswerError(rawPayload, AnswerType.SU, "something failed");

    const data = await db.rawAnswerError.findMany();

    expect(data.length).toBe(1);
    expect(data[0]?.rawPayload).toMatchObject(rawPayload);
    expect(data[0]?.answerType).toBe(AnswerType.SU);
    expect(data[0]?.errorMessage).toBe("something failed");
    expect(data[0]?.status).toBe(AnswerErrorStatus.ACTIVE);
    expect(data[0]?.retryCount).toBe(0);
    expect(data[0]?.resolvedAt).toBeNull();
  });

  it("should save without an error message when none is provided", async () => {
    await createAnswerError({ foo: "bar" }, AnswerType.WAY_OF_LIFE);

    const data = await db.rawAnswerError.findMany();

    expect(data[0]?.errorMessage).toBeNull();
  });

  it("should update the existing active row instead of creating a duplicate when externalId matches", async () => {
    const first = await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "first failure",
      "typeform-token-1",
    );

    const second = await createAnswerError(
      { foo: "bar", retried: true },
      AnswerType.SU,
      "second failure",
      "typeform-token-1",
    );

    const data = await db.rawAnswerError.findMany();

    expect(data.length).toBe(1);
    expect(second.id).toBe(first.id);
    expect(data[0]?.rawPayload).toMatchObject({ foo: "bar", retried: true });
    expect(data[0]?.errorMessage).toBe("second failure");
    expect(data[0]?.retryCount).toBe(1);
    expect(data[0]?.externalId).toBe("typeform-token-1");
  });

  it("should not merge rows from a different answer type sharing the same externalId", async () => {
    await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "su failure",
      "shared-token",
    );
    await createAnswerError(
      { foo: "bar" },
      AnswerType.WAY_OF_LIFE,
      "way of life failure",
      "shared-token",
    );

    const data = await db.rawAnswerError.findMany();

    expect(data.length).toBe(2);
  });

  it("should create a new row when the previous one for the same externalId is already resolved", async () => {
    const first = await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "first failure",
      "typeform-token-2",
    );
    await recordAnswerErrorAttempt(first.id, { success: true });

    await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "new failure",
      "typeform-token-2",
    );

    const data = await db.rawAnswerError.findMany();

    expect(data.length).toBe(2);
  });
});

import { AnswerErrorStatus, AnswerType } from "@prisma/client";
import { db } from "../db";
import { clearAlldata } from "../test-utils/clear";
import { createAnswerError } from "./create";

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
});

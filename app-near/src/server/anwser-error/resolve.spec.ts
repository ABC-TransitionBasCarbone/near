import { AnswerErrorStatus, AnswerType } from "@prisma/client";
import { db } from "../db";
import { clearAlldata } from "../test-utils/clear";
import { createAnswerError } from "./create";
import { resolveAnswerErrorsByExternalId } from "./resolve";

describe("resolveAnswerErrorsByExternalId", () => {
  beforeEach(async () => {
    await clearAlldata();
  });

  it("should resolve the active row matching the externalId and type", async () => {
    const error = await createAnswerError(
      { foo: "bar" },
      AnswerType.SU,
      "failure",
      "typeform-token",
    );

    await resolveAnswerErrorsByExternalId("typeform-token", AnswerType.SU);

    const updated = await db.rawAnswerError.findUniqueOrThrow({
      where: { id: error.id },
    });

    expect(updated.status).toBe(AnswerErrorStatus.RESOLVED);
    expect(updated.resolvedAt).not.toBeNull();
    expect(updated.comment).toBeTruthy();
  });

  it("should do nothing when externalId is undefined", async () => {
    await createAnswerError({ foo: "bar" }, AnswerType.SU, "failure");

    await resolveAnswerErrorsByExternalId(undefined, AnswerType.SU);

    const data = await db.rawAnswerError.findMany();
    expect(data[0]?.status).toBe(AnswerErrorStatus.ACTIVE);
  });

  it("should not resolve rows from a different answer type sharing the same externalId", async () => {
    await createAnswerError(
      { foo: "bar" },
      AnswerType.WAY_OF_LIFE,
      "failure",
      "shared-token",
    );

    await resolveAnswerErrorsByExternalId("shared-token", AnswerType.SU);

    const data = await db.rawAnswerError.findMany();
    expect(data[0]?.status).toBe(AnswerErrorStatus.ACTIVE);
  });
});

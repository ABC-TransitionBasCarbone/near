import { valideSuSurveyPayload } from "../test-utils/suSurvey";
import { handleAnswer } from "./handleAnswer";
import { signPayload } from "./signature";
import { db } from "../db";

describe("handleAnswer", () => {
  const neighborhoodName = "neighborhood_test";
  beforeEach(async () => {
    await db.suAnswer.deleteMany();
    await db.survey.deleteMany();
    await db.survey.create({
      data: { name: neighborhoodName },
    });
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buildRequest = (payload: any, signature: string) => ({
    text: async () => JSON.stringify(payload),
    headers: {
      get: () => signature,
    },
  });

  it("should return 400 when wrong body", async () => {
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest({ body: "wrong-body" }, "signature"),
    );

    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid payload");
  });

  it("should return 401 when signature is invalid", async () => {
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(valideSuSurveyPayload, "wrong-signature"),
    );
    expect(response.status).toBe(401);
    expect(await response.text()).toContain("Not authorized");
  });

  it("should return 400 when transformed data is invalid", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(JSON.stringify(valideSuSurveyPayload));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    payload.form_response.answers.splice(2, 2);
    const signature = signPayload(JSON.stringify(payload));

    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Invalid payload");
  });

  it("should return 400 when neighborhood is not defined", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const signature = signPayload(JSON.stringify(valideSuSurveyPayload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(valideSuSurveyPayload, signature),
    );
    expect(response.status).toBe(400);
    expect(await response.text()).toContain("Survey name not found");
  });

  it("should return 201", async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = JSON.parse(JSON.stringify(valideSuSurveyPayload));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    payload.form_response.hidden = { neighborhood: neighborhoodName };
    const signature = signPayload(JSON.stringify(payload));
    const response = await handleAnswer(
      // @ts-expect-error allow partial for test
      buildRequest(payload, signature),
    );
    expect(response.status).toBe(201);
    expect(await response.text()).toContain("created");
  });
});

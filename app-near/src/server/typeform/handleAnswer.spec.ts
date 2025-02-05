import { handleAnswer } from "./handleAnswer";

describe("handleAnswer", () => {
  it("should return error when wrong body", async () => {
    // @ts-expect-error allow partial for test
    const result = await handleAnswer({
      text: async () => "wrong-body",
    });

    expect(result.json()).toBe("test");
  });
});

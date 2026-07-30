import { safeString } from "./sanitize";

describe("safeString", () => {
  it.each([
    [
      {
        label: "should return empty string for empty input",
        input: "",
        expectedSuccess: true,
      },
    ],
    [
      {
        label: "should keep not dangerous text",
        input: "Hello world",
        expectedSuccess: true,
      },
    ],
    [
      {
        label: "should remove script tags",
        input: '<script>alert("xss")</script>',
        expectedSuccess: false,
      },
    ],
    [
      {
        label: "should remove HTML tags",
        input: '<a href="javascript:alert(1)">Click</a>',
        expectedSuccess: false,
      },
    ],
  ])("$label", ({ input, expectedSuccess }) => {
    const result = safeString.safeParse(input);
    expect(result.success).toBe(expectedSuccess);
  });
});

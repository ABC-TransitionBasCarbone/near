import { slugify } from "./slugify";

describe("slugify", () => {
  it.each([
    {
      label: "should keep alphanumeric characters unchanged",
      input: "Quartier42",
      expected: "quartier42",
    },
    {
      label: "should replace spaces with dashes",
      input: "Quartier Nord",
      expected: "quartier-nord",
    },
    {
      label: "should collapse repeated whitespace into a single dash",
      input: "  Quartier   Nord  ",
      expected: "quartier-nord",
    },
    {
      label: "should strip accents down to their base letters",
      input: "Éàçôquartier",
      expected: "eacoquartier",
    },
    {
      label: "should collapse consecutive non-alphanumeric characters",
      input: "a---b__c   d",
      expected: "a-b-c-d",
    },
    {
      label: "should trim leading and trailing hyphens",
      input: "  -Bonjour-  ",
      expected: "bonjour",
    },
    {
      label: "should remove characters unsafe for a filename or HTTP header",
      input: 'Quartier "Nord" / Sud\\Est',
      expected: "quartier-nord-sud-est",
    },
    {
      label: "should strip characters that could inject HTTP headers",
      input: 'Nord\r\nContent-Disposition: evil"; x="',
      expected: "nord-content-disposition-evil-x",
    },
    {
      label: "should return an empty string for an empty input",
      input: "",
      expected: "",
    },
  ])("$label", ({ input, expected }) => {
    expect(slugify(input)).toBe(expected);
  });
});

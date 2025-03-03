import {
  getBelowThresholdValues,
  isRepresentativenessValid,
} from "./threshold";

describe("threshold", () => {
  describe("getBelowThresholdValues", () => {
    it("should filter values bellow threshold", () => {
      const criteria = {
        a: -1.501,
        b: -1.8,
        c: -1.499,
      };
      const threshold = -1.5;

      const result = getBelowThresholdValues(criteria, threshold);
      expect(result).toEqual({
        a: -1.501,
        b: -1.8,
      });
    });
  });

  describe("isRepresentativenessValid", () => {
    const tests = [
      {
        criteria: { a: 0.99 },
        label: "valid representativeness with positive value",
        expected: true,
      },
      {
        criteria: { a: -0.99 },
        label: "valid representativeness with negative value",
        expected: true,
      },
      {
        criteria: { a: 1 },
        label: "not valid representativeness with positive value",
        expected: false,
      },
      {
        criteria: { a: -1 },
        label: "not valid representativeness with negative value",
        expected: false,
      },
    ];
    it.each(tests)("should return $label", ({ criteria, expected }) => {
      const result = isRepresentativenessValid(criteria, 1);
      expect(result).toBe(expected);
    });
  });
});

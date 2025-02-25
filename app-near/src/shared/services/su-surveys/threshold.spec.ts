import { getBelowThresholdValues } from "./threshold";

describe("threshold", () => {
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

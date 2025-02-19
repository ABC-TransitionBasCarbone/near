import { getBelowThresholdValues } from "./threshold";

describe("threshold", () => {
  it("should filter values bellow threshold", () => {
    const criteria = {
      a: 3,
      b: 3.499,
      c: 3.501,
    };
    const threshold = 3.5;

    const result = getBelowThresholdValues(criteria, threshold);
    expect(result).toEqual({
      a: 3,
      b: 3.499,
    });
  });
});

import { chunkArray } from "./arrays";

describe("arrays", () => {
  describe("chunkArray", () => {
    it("should chunk array", () => {
      const result = chunkArray([1, 2, 3, 4, 5, 6, 7], 4);

      expect(result).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7],
      ]);
    });
  });
});

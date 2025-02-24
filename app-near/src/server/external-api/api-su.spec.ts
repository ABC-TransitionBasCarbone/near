import { computeSus } from "./api-su";

// Skipped because it requires a running flask API (not available on CI yet)
describe.skip("API SU", () => {
  it("should return 200 when called with valid data", async () => {
    const inputData = [
      {
        id: 100,
        meatFrequency: 1,
        transportationMode: 3,
        purchasingStrategy: 2,
        airTravelFrequency: 3,
        heatSource: 2,
        digitalIntensity: 3,
      },
      {
        id: 101,
        meatFrequency: 1,
        transportationMode: 3,
        purchasingStrategy: 1,
        airTravelFrequency: 3,
        heatSource: 2,
        digitalIntensity: 2,
      },
      {
        id: 102,
        meatFrequency: 2,
        transportationMode: 3,
        purchasingStrategy: 1,
        airTravelFrequency: 3,
        heatSource: 2,
        digitalIntensity: 2,
      },
    ];
    const response = await computeSus(inputData);
    expect(response.computedSus).toBeDefined();
    expect(response.answerAttributedSu).toHaveLength(inputData.length);
  });
});

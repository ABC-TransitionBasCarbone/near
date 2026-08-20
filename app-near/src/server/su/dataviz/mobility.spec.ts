import { classifyMobilityType, classifyTrip } from "./mobility";

describe("classifyTrip", () => {
  it("should return NSP when mode or time is missing", () => {
    expect(classifyTrip(null, "LESS_THAN_10_MIN")).toBe("NSP");
    expect(classifyTrip("WALKING", null)).toBe("NSP");
    expect(classifyTrip(undefined, undefined)).toBe("NSP");
  });

  it("should return NSP when the respondent doesn't travel", () => {
    expect(classifyTrip("NONE_I_DONT_MOVE", "LESS_THAN_10_MIN")).toBe("NSP");
  });

  it("should return A for any mode under 10 minutes", () => {
    expect(classifyTrip("CAR", "LESS_THAN_10_MIN")).toBe("A");
    expect(classifyTrip("WALKING", "LESS_THAN_10_MIN")).toBe("A");
  });

  it("should return A for slow modes between 10 and 20 minutes", () => {
    expect(classifyTrip("WALKING", "BETWEEN_10_AND_20_MIN")).toBe("A");
    expect(classifyTrip("PERSONAL_BICYCLE", "BETWEEN_10_AND_20_MIN")).toBe("A");
    expect(classifyTrip("SHARED_BICYCLE", "BETWEEN_10_AND_20_MIN")).toBe("A");
  });

  it("should return B for fast modes between 10 and 20 minutes", () => {
    expect(classifyTrip("CAR", "BETWEEN_10_AND_20_MIN")).toBe("B");
    expect(classifyTrip("PUBLIC_TRANSPORT", "BETWEEN_10_AND_20_MIN")).toBe("B");
  });

  it("should return B beyond 20 minutes regardless of mode", () => {
    expect(classifyTrip("WALKING", "BETWEEN_20_AND_30_MIN")).toBe("B");
    expect(classifyTrip("CAR", "ABOVE_45_MIN")).toBe("B");
  });
});

describe("classifyMobilityType", () => {
  it("should map each mode to its aggregated mobility type", () => {
    expect(classifyMobilityType("WALKING")).toBe("FOOT");
    expect(classifyMobilityType("PERSONAL_BICYCLE")).toBe("BIKE");
    expect(classifyMobilityType("SHARED_BICYCLE")).toBe("BIKE");
    expect(classifyMobilityType("PUBLIC_TRANSPORT")).toBe("TRANS");
    expect(classifyMobilityType("CAR")).toBe("CAR");
    expect(classifyMobilityType("ELECTRIC_CAR")).toBe("CAR");
    expect(classifyMobilityType("TAXI_VTC")).toBe("CAR");
  });

  it("should return null when the respondent doesn't travel or mode is unset", () => {
    expect(classifyMobilityType("NONE_I_DONT_MOVE")).toBeNull();
    expect(classifyMobilityType(null)).toBeNull();
  });
});

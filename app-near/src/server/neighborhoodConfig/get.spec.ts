import { db } from "../db";
import { neighborhoodConfigIsCompleted } from "./get";

describe("neighborhoodConfigIsCompleted", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should return false when no neighborhood config exists for the survey", async () => {
    jest.spyOn(db.neighborhoodConfig, "findUnique").mockResolvedValue(null);

    const result = await neighborhoodConfigIsCompleted(1);

    expect(result).toBe(false);
  });

  it("should return false when at least one field is empty", async () => {
    jest.spyOn(db.neighborhoodConfig, "findUnique").mockResolvedValue({
      id: 1,
      surveyId: 1,
      northCloseLocations: "Parc",
      northDistantLocations: "Gare",
      southCloseLocations: "Marché",
      southDistantLocations: "Mairie",
      eastCloseLocations: "École",
      eastDistantLocations: "Hôpital",
      westCloseLocations: "Boulangerie",
      westDistantLocations: null,
    });

    const result = await neighborhoodConfigIsCompleted(1);

    expect(result).toBe(false);
  });

  it("should return true when every field is filled", async () => {
    jest.spyOn(db.neighborhoodConfig, "findUnique").mockResolvedValue({
      id: 1,
      surveyId: 1,
      northCloseLocations: "Parc",
      northDistantLocations: "Gare",
      southCloseLocations: "Marché",
      southDistantLocations: "Mairie",
      eastCloseLocations: "École",
      eastDistantLocations: "Hôpital",
      westCloseLocations: "Boulangerie",
      westDistantLocations: "Aéroport",
    });

    const result = await neighborhoodConfigIsCompleted(1);

    expect(result).toBe(true);
  });

  it("should query the neighborhood config for the given survey id", async () => {
    const findUniqueSpy = jest
      .spyOn(db.neighborhoodConfig, "findUnique")
      .mockResolvedValue(null);

    await neighborhoodConfigIsCompleted(42);

    expect(findUniqueSpy).toHaveBeenCalledWith({ where: { surveyId: 42 } });
  });
});

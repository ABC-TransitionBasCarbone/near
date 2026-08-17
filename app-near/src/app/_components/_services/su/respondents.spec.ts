import { SurveyType } from "~/types/enums/survey";
import { type SuCount } from "~/types/SuCount";
import { buildChartSections } from "./respondents";

const buildSuCount = (overrides: Partial<SuCount>): SuCount => ({
  id: 1,
  su: "bank-a",
  popPercentage: 0,
  carbonFootprintAnswerCount: 0,
  wayOfLifeAnswerCount: 0,
  ...overrides,
});

describe("buildChartSections", () => {
  it("should return one section per survey type, with title and surveyType", () => {
    const result = buildChartSections([], 1000);

    expect(result).toStrictEqual([
      {
        title: "Espace et Mode de vie",
        surveyType: SurveyType.WAY_OF_LIFE,
        config: [],
      },
      {
        title: "Empreinte carbone",
        surveyType: SurveyType.CARBON_FOOTPRINT,
        config: [],
      },
    ]);
  });

  it("should use wayOfLifeAnswerCount as value for the way of life section", () => {
    const suCounts = [
      buildSuCount({
        su: "bank-b",
        wayOfLifeAnswerCount: 7,
        carbonFootprintAnswerCount: 3,
      }),
    ];

    const result = buildChartSections(suCounts, 1000);
    const wayOfLifeSection = result.find(
      (section) => section.surveyType === SurveyType.WAY_OF_LIFE,
    );

    expect(wayOfLifeSection?.config).toStrictEqual([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { label: "bank-b", value: 7, threshold: expect.any(Number) },
    ]);
  });

  it("should use carbonFootprintAnswerCount as value for the carbon footprint section", () => {
    const suCounts = [
      buildSuCount({
        su: "bank-b",
        wayOfLifeAnswerCount: 7,
        carbonFootprintAnswerCount: 3,
      }),
    ];

    const result = buildChartSections(suCounts, 1000);
    const carbonFootprintSection = result.find(
      (section) => section.surveyType === SurveyType.CARBON_FOOTPRINT,
    );

    expect(carbonFootprintSection?.config).toStrictEqual([
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      { label: "bank-b", value: 3, threshold: expect.any(Number) },
    ]);
  });

  it("should sort the config by label (su) ascending", () => {
    const suCounts = [
      buildSuCount({ su: "bank-c" }),
      buildSuCount({ su: "bank-a" }),
      buildSuCount({ su: "bank-b" }),
    ];

    const result = buildChartSections(suCounts, 1000);
    const wayOfLifeSection = result.find(
      (section) => section.surveyType === SurveyType.WAY_OF_LIFE,
    );

    expect(wayOfLifeSection?.config.map((item) => item.label)).toStrictEqual([
      "bank-a",
      "bank-b",
      "bank-c",
    ]);
  });

  it.each([
    { popPercentage: 1, neighborhoodPopulation: 100, expectedThreshold: 20 },
    { popPercentage: 50, neighborhoodPopulation: 1000, expectedThreshold: 65 },
    { popPercentage: 100, neighborhoodPopulation: 1000, expectedThreshold: 80 },
  ])(
    "should compute the required answers threshold from the estimated su population (%#)",
    ({ popPercentage, neighborhoodPopulation, expectedThreshold }) => {
      const suCounts = [buildSuCount({ popPercentage })];

      const result = buildChartSections(suCounts, neighborhoodPopulation);

      expect(result[0]?.config[0]?.threshold).toBe(expectedThreshold);
    },
  );
});

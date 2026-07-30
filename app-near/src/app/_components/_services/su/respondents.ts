import { SurveyType } from "~/types/enums/survey";
import { type SuCount } from "~/types/SuCount";

const REQUIRED_ANSWERS: {
  minPopulation: number;
  requiredAnswers: number;
}[] = [
  { minPopulation: 1000, requiredAnswers: 80 },
  { minPopulation: 500, requiredAnswers: 65 },
  { minPopulation: 1, requiredAnswers: 20 },
];

const getRequiredAnswerCount = (
  suPopPercentage: number,
  neighborhoodPopulation: number,
): number => {
  const estimatedPopulation = (suPopPercentage / 100) * neighborhoodPopulation;
  return (
    REQUIRED_ANSWERS.sort((a, b) => b.minPopulation - a.minPopulation).find(
      (item) => estimatedPopulation >= item.minPopulation,
    )?.requiredAnswers ?? 0
  );
};

const buildBarChartConfig = (
  suCounts: SuCount[],
  neighborhoodPopulation: number,
  surveyType: SurveyType,
) =>
  suCounts
    .map((suCount) => ({
      label: suCount.su,
      value:
        surveyType === SurveyType.CARBON_FOOTPRINT
          ? suCount.carbonFootprintAnswerCount
          : suCount.wayOfLifeAnswerCount,
      threshold: getRequiredAnswerCount(
        suCount.popPercentage,
        neighborhoodPopulation,
      ),
    }))
    .sort((a, b) => a.label - b.label);

const CHART_SECTIONS: { title: string; surveyType: SurveyType }[] = [
  { title: "Espace et Mode de vie", surveyType: SurveyType.WAY_OF_LIFE },
  { title: "Empreinte carbone", surveyType: SurveyType.CARBON_FOOTPRINT },
];

export const buildChartSections = (
  suCounts: SuCount[],
  neighborhoodPopulation: number,
) =>
  CHART_SECTIONS.map(({ title, surveyType }) => ({
    title,
    surveyType,
    config: buildBarChartConfig(suCounts, neighborhoodPopulation, surveyType),
  }));

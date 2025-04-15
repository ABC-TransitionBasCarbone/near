import {
  AirTravelFrequency,
  DigitalIntensity,
  HeatSource,
  MeatFrequency,
  PurchasingStrategy,
  type SuAnswer,
  TransportationMode,
} from ".prisma/client";
import {
  type SuInformationToCompute,
  type SuAnswerData,
  type SuAnswerDataWithId,
} from "~/types/SuDetection";

const meatFrequencyMap: Record<MeatFrequency, number> = {
  [MeatFrequency.MINOR]: 1,
  [MeatFrequency.REGULAR]: 2,
  [MeatFrequency.MAJOR]: 3,
};

const transportationModeMap: Record<TransportationMode, number> = {
  [TransportationMode.LIGHT]: 1,
  [TransportationMode.PUBLIC]: 2,
  [TransportationMode.CAR]: 3,
};

const digitalIntensityMap: Record<DigitalIntensity, number> = {
  [DigitalIntensity.LIGHT]: 1,
  [DigitalIntensity.REGULAR]: 2,
  [DigitalIntensity.INTENSE]: 3,
};

const purchasingStategyMap: Record<PurchasingStrategy, number> = {
  [PurchasingStrategy.SECOND_HAND]: 1,
  [PurchasingStrategy.MIXED]: 2,
  [PurchasingStrategy.NEW]: 3,
};

const airTravelFrequencyMap: Record<AirTravelFrequency, number> = {
  [AirTravelFrequency.ZERO]: 1,
  [AirTravelFrequency.FROM_1_TO_3]: 2,
  [AirTravelFrequency.ABOVE_3]: 3,
};

const heatSourceMap: Record<HeatSource, number> = {
  [HeatSource.ELECTRICITY]: 1,
  [HeatSource.GAZ]: 2,
  [HeatSource.OIL]: 3,
};

export const convertToSuAnswerData = (
  suAnswer: SuInformationToCompute,
): SuAnswerData => {
  return {
    meatFrequency: meatFrequencyMap[suAnswer.meatFrequency],
    transportationMode: transportationModeMap[suAnswer.transportationMode],
    digitalIntensity: digitalIntensityMap[suAnswer.digitalIntensity],
    purchasingStrategy: purchasingStategyMap[suAnswer.purchasingStrategy],
    airTravelFrequency: airTravelFrequencyMap[suAnswer.airTravelFrequency],
    heatSource: heatSourceMap[suAnswer.heatSource],
  };
};

export const convertToSuAnswerDataWithId = (
  suAnswer: SuAnswer,
): SuAnswerDataWithId => {
  return {
    ...convertToSuAnswerData(suAnswer),
    id: suAnswer.id,
  };
};

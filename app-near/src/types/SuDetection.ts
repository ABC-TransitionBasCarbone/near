export interface SuAnswerData {
  id: number;
  meatFrequency: number;
  transportationMode: number;
  digitalIntensity: number;
  purchasingStrategy: number;
  airTravelFrequency: number;
  heatSource: number;
}

export interface SuComputationData {
  computedSus: ComputedSu[];
  answerAttributedSu: AnswerAttributedSu[];
  error: unknown;
}

export interface ComputedSu {
  su: number;
  barycenter: number[];
  popPercentage: number;
}

export interface AnswerAttributedSu {
  id: number;
  su: number;
  distanceToBarycenter: number;
}

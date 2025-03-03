export interface SuAnswerData {
  meatFrequency: number;
  transportationMode: number;
  digitalIntensity: number;
  purchasingStrategy: number;
  airTravelFrequency: number;
  heatSource: number;
}

export interface SuAnswerDataWithId extends SuAnswerData {
  id: number;
}

export interface SuComputationData {
  computedSus: ComputedSu[];
  answerAttributedSu: AnswerAttributedSuWithId[];
}

export interface SuDataToAssign {
  su: number;
  barycenter: number[];
}
export interface ComputedSu extends SuDataToAssign {
  popPercentage: number;
}

export interface AnswerAttributedSu {
  su: number;
  distanceToBarycenter: number;
}

export interface AnswerAttributedSuWithId extends AnswerAttributedSu {
  id: number;
}

export interface SuAssignementRequest {
  sus: SuDataToAssign[];
  userData: SuAnswerData;
}

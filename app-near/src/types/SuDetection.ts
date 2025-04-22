import {
  type AirTravelFrequency,
  type DigitalIntensity,
  type HeatSource,
  type MeatFrequency,
  type PurchasingStrategy,
  type TransportationMode,
} from "@prisma/client";
import { z } from "zod";

export interface SuInformationToCompute {
  meatFrequency: MeatFrequency;
  transportationMode: TransportationMode;
  digitalIntensity: DigitalIntensity;
  purchasingStrategy: PurchasingStrategy;
  airTravelFrequency: AirTravelFrequency;
  heatSource: HeatSource;
}

const suAnswerDataValidation = z.object({
  meatFrequency: z.number(),
  transportationMode: z.number(),
  digitalIntensity: z.number(),
  purchasingStrategy: z.number(),
  airTravelFrequency: z.number(),
  heatSource: z.number(),
});

export type SuAnswerData = z.infer<typeof suAnswerDataValidation>;

export interface SuAnswerDataWithId extends SuAnswerData {
  id: number;
}

export interface SuComputationData {
  computedSus: ComputedSu[];
  answerAttributedSu: AnswerAttributedSuWithId[];
}

const suDataToAssignValidation = z.object({
  su: z.number(),
  barycenter: z.array(z.number()),
});

export type SuDataToAssign = z.infer<typeof suDataToAssignValidation>;

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

export const suAssignementRequestValidation = z.object({
  sus: z.array(suDataToAssignValidation),
  userData: suAnswerDataValidation,
});

export type SuAssignementRequest = z.infer<
  typeof suAssignementRequestValidation
>;

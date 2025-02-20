import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
  Gender,
  HeatSource,
  MeatFrequency,
  ProfessionalCategory,
  PurchasingStrategy,
  type SuAnswer,
  TransportationMode,
} from "@prisma/client";
import { z } from "zod";

export const convertedSuAnswer = z.object({
  isNeighborhoodResident: z.boolean(),
  ageCategory: z.nativeEnum(AgeCategory),
  gender: z.nativeEnum(Gender),
  professionalCategory: z.nativeEnum(ProfessionalCategory),
  easyHealthAccess: z.nativeEnum(EasyHealthAccess),
  meatFrequency: z.nativeEnum(MeatFrequency),
  transportationMode: z.nativeEnum(TransportationMode),
  digitalIntensity: z.nativeEnum(DigitalIntensity),
  purchasingStrategy: z.nativeEnum(PurchasingStrategy),
  airTravelFrequency: z.nativeEnum(AirTravelFrequency),
  heatSource: z.nativeEnum(HeatSource),
  email: z.string().email().optional(),
});

export type BuilderSuAnswer = Omit<
  SuAnswer,
  "id" | "userSu" | "distanceToBarycentre"
> &
  Partial<Pick<SuAnswer, "id" | "su" | "distanceToBarycentre">>;

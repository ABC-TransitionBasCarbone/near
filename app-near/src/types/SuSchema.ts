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
  TransportationMode,
} from "@prisma/client";
import { z } from "zod";

export const suSchema = z.object({
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

export type SuSchema = z.infer<typeof suSchema>;

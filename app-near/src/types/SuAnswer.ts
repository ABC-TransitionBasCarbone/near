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
  type Quartier,
  type SuAnswer,
  TransportationMode,
} from "@prisma/client";
import { z } from "zod";

export const convertedSuAnswer = z.object({
  isNeighborhoodResident: z.literal(true),
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

export type ConvertedSuAnswer = z.infer<typeof convertedSuAnswer>;

export type BuilderSuAnswer = Omit<
  SuAnswer,
  "id" | "userSu" | "userDistanceToSuBarycentre"
> &
  Partial<Pick<SuAnswer, "id" | "userSu" | "userDistanceToSuBarycentre">>;

export enum CategoryStat {
  man = "man",
  woman = "woman",
  above_75 = "above_75",
  from_60_to_74 = "from_60_to_74",
  from_45_to_59 = "from_45_to_59",
  from_30_to_44 = "from_30_to_44",
  from_15_to_29 = "from_15_to_29",
  cs1 = "cs1",
  cs2 = "cs2",
  cs3 = "cs3",
  cs4 = "cs4",
  cs5 = "cs5",
  cs6 = "cs6",
  cs7 = "cs7",
  cs8 = "cs8",
}

export type CategoryStats = Record<CategoryStat, number>;

export const categoryStatQuartierMap: Record<CategoryStat, keyof Quartier> = {
  [CategoryStat.man]: "population_homme_sum",
  [CategoryStat.woman]: "population_femme_sum",
  [CategoryStat.above_75]: "p21_pop75p_sum",
  [CategoryStat.from_60_to_74]: "p21_pop6074_sum",
  [CategoryStat.from_45_to_59]: "p21_pop4559_sum",
  [CategoryStat.from_30_to_44]: "p21_pop3044_sum",
  [CategoryStat.from_15_to_29]: "p21_pop1529_sum",
  [CategoryStat.cs1]: "c21_pop15p_cs1_sum",
  [CategoryStat.cs2]: "c21_pop15p_cs2_sum",
  [CategoryStat.cs3]: "c21_pop15p_cs3_sum",
  [CategoryStat.cs4]: "c21_pop15p_cs4_sum",
  [CategoryStat.cs5]: "c21_pop15p_cs5_sum",
  [CategoryStat.cs6]: "c21_pop15p_cs6_sum",
  [CategoryStat.cs7]: "c21_pop15p_cs7_sum",
  [CategoryStat.cs8]: "c21_pop15p_cs8_sum",
};

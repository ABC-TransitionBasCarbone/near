import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
  Gender,
  HeatSource,
  MeatFrequency,
  ProfessionalCategory,
  ProfessionalSituation,
  PurchasingStrategy,
  type Quartier,
  type SuAnswer,
  TransportationMode,
} from "@prisma/client";
import { z } from "zod";
import { CurrentProfessionalCategory } from "./enums/professionalCategory";
import { shouldHaveProfessionalCategory } from "../shared/services/su-answers/shouldHaveProfessionalCategory";

export const convertedSuAnswer = z
  .object({
    isNeighborhoodResident: z.literal(true),
    ageCategory: z.nativeEnum(AgeCategory),
    gender: z.nativeEnum(Gender),
    professionalSituation: z.nativeEnum(ProfessionalSituation),
    professionalCategory: z.nativeEnum(CurrentProfessionalCategory).optional(),
    easyHealthAccess: z.nativeEnum(EasyHealthAccess),
    meatFrequency: z.nativeEnum(MeatFrequency),
    transportationMode: z.nativeEnum(TransportationMode),
    digitalIntensity: z.nativeEnum(DigitalIntensity),
    purchasingStrategy: z.nativeEnum(PurchasingStrategy),
    airTravelFrequency: z.nativeEnum(AirTravelFrequency),
    heatSource: z.nativeEnum(HeatSource),
    email: z.string().email().or(z.literal("")).optional().nullable(),
  })
  .refine(shouldHaveProfessionalCategory, {
    message: "missing professionalCategory",
  });

export type ConvertedSuAnswer = z.infer<typeof convertedSuAnswer>;

export type BuilderSuAnswer = Omit<
  SuAnswer,
  "id" | "su" | "distanceToBarycenter" | "createdAt" | "updatedAt"
> &
  Partial<
    Pick<
      SuAnswer,
      "id" | "suId" | "distanceToBarycenter" | "createdAt" | "updatedAt"
    >
  >;

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

export const enumValueToCategoryStat: Record<
  AgeCategory | Gender | ProfessionalCategory,
  CategoryStat | undefined
> = {
  [AgeCategory.ABOVE_75]: CategoryStat.above_75,
  [AgeCategory.FROM_15_TO_29]: CategoryStat.from_15_to_29,
  [AgeCategory.FROM_30_TO_44]: CategoryStat.from_30_to_44,
  [AgeCategory.FROM_45_TO_59]: CategoryStat.from_45_to_59,
  [AgeCategory.FROM_60_TO_74]: CategoryStat.from_60_to_74,
  [Gender.MAN]: CategoryStat.man,
  [Gender.WOMAN]: CategoryStat.woman,
  [Gender.OTHER]: undefined, // Insee has no target for this category
  [ProfessionalCategory.CS1]: CategoryStat.cs1,
  [ProfessionalCategory.CS2]: CategoryStat.cs2,
  [ProfessionalCategory.CS2_platform_entrepreneurship]: CategoryStat.cs2,
  [ProfessionalCategory.CS3]: CategoryStat.cs3,
  [ProfessionalCategory.CS4]: CategoryStat.cs4,
  [ProfessionalCategory.CS5]: CategoryStat.cs5,
  [ProfessionalCategory.CS6]: CategoryStat.cs6,
  [ProfessionalCategory.CS7]: CategoryStat.cs7,
  [ProfessionalCategory.CS8_student]: CategoryStat.cs8,
  [ProfessionalCategory.CS8_unemployed]: CategoryStat.cs8,
  [ProfessionalCategory.CS8_home]: CategoryStat.cs8,
};

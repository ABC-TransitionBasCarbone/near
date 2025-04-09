import {
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  FoodFrequency,
  Gender,
  GiveFreeTimeToHelp,
  HeatSource,
  HomeOccupationType,
  HowManyPeopleCanIHelp,
  MeatFrequency,
  ParksUsageFrequency,
  ProfessionalCategory,
  PurchasingStrategy,
  TransportationMode,
  TransportMode,
  TransportModeToStation,
  TransportModeToTravel,
  TransportTime,
  TypeOfFood,
  WishesChoices,
  YesNo,
  type WayOfLifeAnswer,
} from "@prisma/client";
import { z } from "zod";

export const convertedWayOfLifeAnswer = z.object({
  email: z.string().email().optional(),
  ageCategory: z.nativeEnum(AgeCategory),
  isNeighborhoodResident: z.boolean(),
  gender: z.nativeEnum(Gender),
  professionalCategory: z.nativeEnum(ProfessionalCategory),
  knowSu: z.boolean(),
  su: z.number().optional(),

  meatFrequency: z.nativeEnum(MeatFrequency).optional(),
  transportationMode: z.nativeEnum(TransportationMode).optional(),
  purchasingStrategy: z.nativeEnum(PurchasingStrategy).optional(),
  airTravelFrequency: z.nativeEnum(AirTravelFrequency).optional(),
  heatSource: z.nativeEnum(HeatSource).optional(),
  digitalIntensity: z.nativeEnum(DigitalIntensity).optional(),

  notColdHouse: z.nativeEnum(YesNo),
  confortHouseWhenHot: z.nativeEnum(YesNo),
  ideaEasyTalk: z.nativeEnum(YesNo),
  homeOccupationType: z.nativeEnum(HomeOccupationType),
  otherHousingInformation: z.string().optional(),
  actionWhenTooCold: z.array(z.string()),
  actionWhenTooHot: z.array(z.string()),

  vegetalParksSatisfaction: z.nativeEnum(YesNo),
  parksUsageFrequency: z.nativeEnum(ParksUsageFrequency),
  otherParksInformation: z.string().optional(),

  easyPublicTransports: z.nativeEnum(YesNo),
  easyWalking: z.nativeEnum(YesNo),
  easyBicycle: z.nativeEnum(YesNo),
  notTooMuchTraffic: z.nativeEnum(YesNo),
  carAnPedestriansRespect: z.nativeEnum(YesNo),
  easyToLeaveCityWithTranports: z.nativeEnum(YesNo),
  otherTransportationInformation: z.string().optional(),

  hardDiscountFrequency: z.nativeEnum(FoodFrequency),
  supermarketFrequency: z.nativeEnum(FoodFrequency),
  hypermarketFrequency: z.nativeEnum(FoodFrequency),
  groceryStoreFrequency: z.nativeEnum(FoodFrequency),
  specializedFoodStoreFrequency: z.nativeEnum(FoodFrequency),
  organicOrSolidarityFoodStoreFrequency: z.nativeEnum(FoodFrequency),
  homeDeliveryFoodStoreFrequency: z.nativeEnum(FoodFrequency),
  classicFoodMarketFrequency: z.nativeEnum(FoodFrequency),
  otherFoodFrequencyInformation: z.string().optional(),

  typeOfFood: z.nativeEnum(TypeOfFood),

  neighborhoodOrganicMarketSatisfaction: z.nativeEnum(YesNo),
  neighborhoodSeasonFruitAndVegetablesSatisfaction: z.nativeEnum(YesNo),
  neighborhoodOrganicProductsSatisfaction: z.nativeEnum(YesNo),
  privateOrShareFieldToFarm: z.nativeEnum(YesNo),
  accessToFoodServiceSatisfaction: z.nativeEnum(YesNo),
  accessToShortFoodCircuitSatisfaction: z.nativeEnum(YesNo),
  otherFoodSatisfactionInformation: z.string().optional(),

  electronicRepairShopSatisfaction: z.nativeEnum(YesNo),
  clothesRepairShopSatisfaction: z.nativeEnum(YesNo),
  bicycleRepairShopSatisfaction: z.nativeEnum(YesNo),
  secondHandShopSatisfaction: z.nativeEnum(YesNo),
  otherRepairShopSatisfactionInformation: z.string().optional(),

  localShopsToMeetYourNeeds: z.nativeEnum(YesNo),
  servicesToShareOrRentObjects: z.nativeEnum(YesNo),
  publicServicesPresence: z.nativeEnum(YesNo),
  otherServicesInformation: z.string().optional(),

  associativeActivity: z.nativeEnum(YesNo),
  culturalActivity: z.nativeEnum(YesNo),
  hobbiesSpaces: z.nativeEnum(YesNo),
  neighborhoodLife: z.nativeEnum(YesNo),
  otherNeighborhoodLifeInformation: z.string().optional(),

  howManyPeopleCanIHelp: z.nativeEnum(HowManyPeopleCanIHelp),
  otherMutualAidInformation: z.string().optional(),

  capacityToShareIdeaToTownHall: z.nativeEnum(YesNo),
  noInformationOnCitizenParticipation: z.nativeEnum(YesNo),
  wantToParticipateToCivicInitiatives: z.nativeEnum(YesNo),
  otherLocalPoliticInformation: z.string().optional(),

  giveFreeTimeToHelp: z.nativeEnum(GiveFreeTimeToHelp),
  yourEngagmentDomains: z.array(z.string()),

  wantToReduceCarUsage: z.nativeEnum(WishesChoices),
  reasonsToContinueUsingCar: z.array(z.string()),

  wantToReduceMeatAndFish: z.nativeEnum(WishesChoices),
  reasonsToEatMeat: z.array(z.string()),

  preferBuyFrenchAndSeasonFood: z.nativeEnum(WishesChoices),
  reasonsToNotBuyFrenchAndSeasonFood: z.array(z.string()),

  preferSecondHand: z.nativeEnum(WishesChoices),
  reasonsToNotChoseSecondHand: z.array(z.string()),

  transportModeToBuyFood: z.nativeEnum(TransportMode),
  transportTimeToBuyFood: z.nativeEnum(TransportTime),
  foodMarketZone: z.string(),

  transportModeToHobby: z.nativeEnum(TransportMode),
  transportTimeToHobby: z.nativeEnum(TransportTime),
  hobbyZone: z.string(),

  remoteWorkingWeeklyFrequency: z.number(),
  transportModeToWork: z.nativeEnum(TransportMode),
  transportTimeToWork: z.nativeEnum(TransportTime),
  workZone: z.string(),

  transportModeToTravel: z.nativeEnum(TransportModeToTravel),
  transportModeToGoToStation: z.nativeEnum(TransportModeToStation),

  comment: z.string().optional(),
  suId: z.number().optional(),
});

export type ConvertedWayOfLifeAnswer = z.infer<typeof convertedWayOfLifeAnswer>;

export type BuilderWayOfLifeAnswer = Omit<
  WayOfLifeAnswer,
  "id" | "createdAt" | "updatedAt" | "su" | "suId"
> &
  Partial<Pick<WayOfLifeAnswer, "createdAt" | "updatedAt" | "suId">>;

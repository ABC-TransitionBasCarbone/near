import {
  ActionWhenTooCold,
  ActionWhenTooHot,
  AgeCategory,
  AirTravelFrequency,
  BroadcastChannel,
  DigitalIntensity,
  EngagmentDomains,
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
  ReasonsToEatMeat,
  ReasonsToNotBuyFrenchSeasonFood,
  ReasonsToNotChoseSecondHand,
  ReasonsUsingCar,
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
import { faker } from "@faker-js/faker";
import { type BuilderWayOfLifeAnswer } from "~/types/WayOfLifeAnswer";

export const buildWayOfLifeAnswer = (
  surveyId: number,
  data?: Partial<WayOfLifeAnswer>,
): BuilderWayOfLifeAnswer => ({
  accessToFoodServiceSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  accessToShortFoodCircuitSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  actionWhenTooCold: faker.helpers.arrayElements(
    Object.values(ActionWhenTooCold),
  ),
  actionWhenTooHot: faker.helpers.arrayElements(
    Object.values(ActionWhenTooHot),
  ),
  ageCategory: faker.helpers.arrayElement(Object.values(AgeCategory)),
  airTravelFrequency: faker.helpers.arrayElement(
    Object.values(AirTravelFrequency),
  ),
  associativeActivity: faker.helpers.arrayElement(Object.values(YesNo)),
  bicycleRepairShopSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  capacityToShareIdeaToTownHall: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  carAnPedestriansRespect: faker.helpers.arrayElement(Object.values(YesNo)),
  classicFoodMarketFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  clothesRepairShopSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  comment: faker.lorem.sentence(),
  confortHouseWhenHot: faker.helpers.arrayElement(Object.values(YesNo)),
  culturalActivity: faker.helpers.arrayElement(Object.values(YesNo)),
  digitalIntensity: faker.helpers.arrayElement(Object.values(DigitalIntensity)),
  easyBicycle: faker.helpers.arrayElement(Object.values(YesNo)),
  easyPublicTransports: faker.helpers.arrayElement(Object.values(YesNo)),
  easyToLeaveCityWithTranports: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  easyWalking: faker.helpers.arrayElement(Object.values(YesNo)),
  electronicRepairShopSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  foodMarketZone: faker.lorem.word(),
  gender: faker.helpers.arrayElement(Object.values(Gender)),
  giveFreeTimeToHelp: faker.helpers.arrayElement(
    Object.values(GiveFreeTimeToHelp),
  ),
  groceryStoreFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  hardDiscountFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  heatSource: faker.helpers.arrayElement(Object.values(HeatSource)),
  hobbiesSpaces: faker.helpers.arrayElement(Object.values(YesNo)),
  hobbyZone: faker.lorem.word(),
  homeDeliveryFoodStoreFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  homeOccupationType: faker.helpers.arrayElement(
    Object.values(HomeOccupationType),
  ),
  howManyPeopleCanIHelp: faker.helpers.arrayElement(
    Object.values(HowManyPeopleCanIHelp),
  ),
  hypermarketFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  ideaEasyTalk: faker.helpers.arrayElement(Object.values(YesNo)),
  knowSu: faker.helpers.arrayElement([true, false]),
  localShopsToMeetYourNeeds: faker.helpers.arrayElement(Object.values(YesNo)),
  meatFrequency: faker.helpers.arrayElement(Object.values(MeatFrequency)),
  neighborhoodLife: faker.helpers.arrayElement(Object.values(YesNo)),
  neighborhoodOrganicMarketSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  neighborhoodOrganicProductsSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  neighborhoodSeasonFruitAndVegetablesSatisfaction: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  noInformationOnCitizenParticipation: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  notColdHouse: faker.helpers.arrayElement(Object.values(YesNo)),
  notTooMuchTraffic: faker.helpers.arrayElement(Object.values(YesNo)),
  organicOrSolidarityFoodStoreFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  otherFoodFrequencyInformation: faker.lorem.sentence(),
  otherFoodSatisfactionInformation: faker.lorem.sentence(),
  otherHousingInformation: faker.lorem.sentence(),
  otherLocalPoliticInformation: faker.lorem.sentence(),
  otherMutualAidInformation: faker.lorem.sentence(),
  otherNeighborhoodLifeInformation: faker.lorem.sentence(),
  otherParksInformation: faker.lorem.sentence(),
  otherRepairShopSatisfactionInformation: faker.lorem.sentence(),
  otherServicesInformation: faker.lorem.sentence(),
  otherTransportationInformation: faker.lorem.sentence(),
  parksUsageFrequency: faker.helpers.arrayElement(
    Object.values(ParksUsageFrequency),
  ),
  preferBuyFrenchAndSeasonFood: faker.helpers.arrayElement(
    Object.values(WishesChoices),
  ),
  preferSecondHand: faker.helpers.arrayElement(Object.values(WishesChoices)),
  privateOrShareFieldToFarm: faker.helpers.arrayElement(Object.values(YesNo)),
  professionalCategory: faker.helpers.arrayElement(
    Object.values(ProfessionalCategory),
  ),
  publicServicesPresence: faker.helpers.arrayElement(Object.values(YesNo)),
  purchasingStrategy: faker.helpers.arrayElement(
    Object.values(PurchasingStrategy),
  ),
  reasonsToContinueUsingCar: faker.helpers.arrayElements(
    Object.values(ReasonsUsingCar),
  ),
  reasonsToEatMeat: faker.helpers.arrayElements(
    Object.values(ReasonsToEatMeat),
  ),
  reasonsToNotBuyFrenchAndSeasonFood: faker.helpers.arrayElements(
    Object.values(ReasonsToNotBuyFrenchSeasonFood),
  ),
  reasonsToNotChoseSecondHand: faker.helpers.arrayElements(
    Object.values(ReasonsToNotChoseSecondHand),
  ),
  remoteWorkingWeeklyFrequency: faker.helpers.arrayElement([
    "1",
    "2",
    "3",
    "4",
    "5",
  ]),
  secondHandShopSatisfaction: faker.helpers.arrayElement(Object.values(YesNo)),
  servicesToShareOrRentObjects: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  specializedFoodStoreFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  supermarketFrequency: faker.helpers.arrayElement(
    Object.values(FoodFrequency),
  ),
  transportationMode: faker.helpers.arrayElement(
    Object.values(TransportationMode),
  ),
  transportModeToBuyFood: faker.helpers.arrayElement(
    Object.values(TransportMode),
  ),
  transportModeToGoToStation: faker.helpers.arrayElement(
    Object.values(TransportModeToStation),
  ),
  transportModeToHobby: faker.helpers.arrayElement(
    Object.values(TransportMode),
  ),
  transportModeToTravel: faker.helpers.arrayElement(
    Object.values(TransportModeToTravel),
  ),
  transportModeToWork: faker.helpers.arrayElement(Object.values(TransportMode)),
  transportTimeToBuyFood: faker.helpers.arrayElement(
    Object.values(TransportTime),
  ),
  transportTimeToHobby: faker.helpers.arrayElement(
    Object.values(TransportTime),
  ),
  transportTimeToWork: faker.helpers.arrayElement(Object.values(TransportTime)),
  typeOfFood: faker.helpers.arrayElement(Object.values(TypeOfFood)),
  vegetalParksSatisfaction: faker.helpers.arrayElement(Object.values(YesNo)),
  wantToParticipateToCivicInitiatives: faker.helpers.arrayElement(
    Object.values(YesNo),
  ),
  wantToReduceCarUsage: faker.helpers.arrayElement(
    Object.values(WishesChoices),
  ),
  wantToReduceMeatAndFish: faker.helpers.arrayElement(
    Object.values(WishesChoices),
  ),
  workZone: faker.lorem.word(),
  yourEngagmentDomains: faker.helpers.arrayElements(
    Object.values(EngagmentDomains),
  ),

  emailApiCalled: false,
  broadcastChannel: faker.helpers.arrayElement(Object.values(BroadcastChannel)),
  email: Date.now() + faker.internet.email(),
  ...data,
  surveyId,
});

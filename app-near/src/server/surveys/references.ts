import {
  ActionWhenTooCold,
  ActionWhenTooHot,
  AgeCategory,
  AirTravelFrequency,
  DigitalIntensity,
  EasyHealthAccess,
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
  VoluntaryWork,
  WishesChoices,
  YesNo,
  ZoneSelection,
} from "@prisma/client";
import { TypeformType } from "~/types/Typeform";

export const surveySUReferencesMapping: Record<string, string | boolean> = {
  // isNeighborhoodResident
  ["6226e10f-baf0-43f8-af05-2cddc649f509"]: true,
  ["3a347ad6-7461-4549-8cf3-d45167702a74"]: false,
  // ageCategory
  ["e56029c8-f14a-45dc-8a90-4e61a0f45581"]: AgeCategory.FROM_15_TO_29,
  ["58756e59-7741-4e9b-8d7b-c16c8eca4361"]: AgeCategory.FROM_30_TO_44,
  ["e1d0ef1b-5caa-4b62-aed0-f8efa82131b3"]: AgeCategory.FROM_45_TO_59,
  ["65b4afe2-e818-456e-b9fe-a5082a9abc79"]: AgeCategory.FROM_60_TO_74,
  ["fa4746bb-223c-4bbc-8a39-ff07a2246a0b"]: AgeCategory.ABOVE_75,
  // gender
  ["191de28b-587d-4f34-b57f-b687c77e1c1e"]: Gender.WOMAN,
  ["1caec0f3-6a02-42e6-9bf7-10030b6d38b6"]: Gender.MAN,
  ["0fea5725-a8da-42a7-b60b-b6eb14746a6c"]: Gender.OTHER,
  // professionalCategory
  ["34937a02-6445-4624-9d37-06158160fedc"]: ProfessionalCategory.CS1,
  ["392aa02d-894f-4359-96e3-dbe902090974"]:
    ProfessionalCategory.CS2_platform_entrepreneurship,
  ["eafa75de-50ee-42b5-8a49-9edc5a665d5c"]: ProfessionalCategory.CS2,
  ["a69d126e-0436-4b3d-b1b7-ba39af69354f"]: ProfessionalCategory.CS3,
  ["d8ff03ac-c2e7-4db7-a4ba-dd1162d31d0d"]: ProfessionalCategory.CS4,
  ["1f383874-b1ba-4b95-84ca-5bb735afb1f3"]: ProfessionalCategory.CS5,
  ["1af27fdf-88ac-4a0c-ae42-3961c1509763"]: ProfessionalCategory.CS6,
  ["144ee3b6-cc45-4c8a-bd6b-d507579a8a27"]: ProfessionalCategory.CS7,
  ["c72b89cf-162b-422c-a55c-cd831494fcfb"]: ProfessionalCategory.CS8_unemployed,
  ["a18b427c-ab45-4534-ad45-326c142a7869"]: ProfessionalCategory.CS8_student,
  ["db5c0ae8-772d-430a-84d6-b6a44026a25c"]: ProfessionalCategory.CS8_home,
  // easyHealthAccess
  ["2360d7d5-b501-4f3e-b829-4b374483849e"]: EasyHealthAccess.EASY,
  ["bd25627f-8aa4-4c43-a013-635e5af4cee0"]: EasyHealthAccess.MODERATE,
  ["9fe68244-2af7-49a0-a9e1-7d5e73878953"]: EasyHealthAccess.HARD,
  // meatFrequency
  ["3beb39cf-2cee-4c3b-81fb-8dd1b1ea3f00"]: MeatFrequency.MINOR,
  ["f3d254c4-0b61-4aa4-9df4-a631475787d6"]: MeatFrequency.REGULAR,
  ["6884a62e-bc9f-47af-8e28-7ea4a27f0230"]: MeatFrequency.MAJOR,
  // transportationMode
  ["8719d78b-30c6-4ef4-b7c4-a4627f594502"]: TransportationMode.CAR,
  ["45402959-78d9-4518-b3c3-ab5d3e4c1feb"]: TransportationMode.PUBLIC,
  ["7612df4d-5cb3-484c-8026-030331c61b3a"]: TransportationMode.LIGHT,
  // digitalIntensity
  ["270e40f2-2aa5-43b2-b9d9-0cadd018442c"]: DigitalIntensity.LIGHT,
  ["8b1e124f-a5d2-4a02-9383-3ef0e5aa7cf9"]: DigitalIntensity.REGULAR,
  ["f04dfe0c-f517-403e-883a-bb8c9de80de8"]: DigitalIntensity.INTENSE,
  // purchasingStrategy
  ["84702054-4b2e-40c9-932a-3bd813d5d646"]: PurchasingStrategy.NEW,
  ["13c4b137-28c3-4cca-ae27-6b228fb52f37"]: PurchasingStrategy.MIXED,
  ["8166cf94-e353-4b46-a522-acd9530782c0"]: PurchasingStrategy.SECOND_HAND,
  // airTravelFrequency
  ["22c056f4-21e7-4e63-8fb6-60b1f5569f8b"]: AirTravelFrequency.ZERO,
  ["e9c48d61-16c8-41a4-a53e-e8d838c539be"]: AirTravelFrequency.FROM_1_TO_3,
  ["04385aba-ae3e-4bda-b32b-1f0c03bec5b8"]: AirTravelFrequency.ABOVE_3,
  // heatSource
  ["6a3d2558-6612-4cf1-90a6-e5e1bf3bbca8"]: HeatSource.ELECTRICITY,
  ["60220a76-eacb-435d-beb9-30c6e139827c"]: HeatSource.GAZ,
  ["8d91547d-f2aa-4987-9d0b-cb3ce17527c5"]: HeatSource.OIL,
};

// TODO NEAR-45 update when form finalized
export const surveyWayOfLifeReferencesMapping: Record<
  string,
  string | boolean
> = {
  // isNeighborhoodResident (not reccorded)
  ["1d182b4a-25d1-4ffe-85b9-9cb6ca4fc416"]: true,
  ["44fb5931-1325-485e-9955-c01ebd635c87"]: false,
  // ageCategory
  ["21f6bc14-8bf2-4cdf-8194-5a2a5f3bb5a8"]: AgeCategory.FROM_15_TO_29,
  ["11a8ef44-bcb9-4280-bc72-468376ba2b45"]: AgeCategory.FROM_30_TO_44,
  ["0daed174-6c35-41f1-9a62-53f0ccca27e6"]: AgeCategory.FROM_45_TO_59,
  ["6107dd89-54a1-4093-9966-13002f52d0e7"]: AgeCategory.FROM_60_TO_74,
  ["40f75668-d031-4433-b85e-0909f022b7c7"]: AgeCategory.ABOVE_75,
  // neighborhoodPurpose -> (no options, not reccorded)
  // gender
  ["2af033b2-851f-436c-9abe-9d1bf252271e"]: Gender.WOMAN,
  ["4289748f-9d7b-4c62-879c-4331fdd79131"]: Gender.MAN,
  ["23039959-dab5-44bf-ad44-635bab0b3be7"]: Gender.OTHER,
  // professionalCategory
  ["0231a148-0377-48c2-bafe-9ad093ff9770"]: ProfessionalCategory.CS1,
  ["aa8f785a-c21f-4eb5-99af-6dc5f0aca46c"]:
    ProfessionalCategory.CS2_platform_entrepreneurship,
  ["7167c411-3fdd-4a86-a5c3-615b3c6a2e6e"]: ProfessionalCategory.CS2,
  ["9bb7ca97-8ff5-4216-92d9-3f88a1b8a19e"]: ProfessionalCategory.CS3,
  ["523b70b5-7dac-4be8-afc5-903bb779dc91"]: ProfessionalCategory.CS4,
  ["b553128c-29d6-4279-b8db-c6be7a95ca42"]: ProfessionalCategory.CS5,
  ["e6186c8b-cc31-415b-b959-7f7a923e66bd"]: ProfessionalCategory.CS6,
  ["527c3197-ea65-4678-865b-dbb8497b90bc"]: ProfessionalCategory.CS7,
  ["d999eafd-db05-4c90-bad2-fcaab1b80f65"]: ProfessionalCategory.CS8_unemployed,
  ["edbad6b2-3a21-410c-8f5e-d247bdc694ff"]: ProfessionalCategory.CS8_student,
  ["21871fa1-d863-414f-a701-a565e5088221"]: ProfessionalCategory.CS8_home,
  // knowSu
  ["af1dfc18-9510-43f3-ba9e-feb1374098c8"]: true,
  ["adac5c32-196e-47a5-9bdd-7e5e99060349"]: false,
  // su -> (no options)
  // meatFrequency
  ["d6d4cb14-aecc-4e0d-ab19-891ce89437fc"]: MeatFrequency.MINOR,
  ["f3d254c4-0b61-4aa4-9df4-a631475787d6"]: MeatFrequency.REGULAR,
  ["6884a62e-bc9f-47af-8e28-7ea4a27f0230"]: MeatFrequency.MAJOR,
  // transportationMode
  ["b397b2de-2526-4cf6-910c-129a2f236545"]: TransportationMode.CAR,
  ["27b785c9-7c30-4cbe-941a-ebaaa2f5b928"]: TransportationMode.PUBLIC,
  ["004844e8-ef47-4e82-8e54-c566cba8684e"]: TransportationMode.LIGHT,
  // purchasingStrategy
  ["b6cb479c-d343-4e46-998e-9fcde817dc18"]: PurchasingStrategy.NEW,
  ["a476a1bd-5053-497f-a73d-2dec30b37871"]: PurchasingStrategy.MIXED,
  ["7fd72693-8836-48c3-a682-66f682ee820e"]: PurchasingStrategy.SECOND_HAND,
  // airTravelFrequency
  ["3006b398-ff26-4824-a0cb-c89e848a32be"]: AirTravelFrequency.ZERO,
  ["2709472e-6f1f-46f0-bbe1-5da9444457a0"]: AirTravelFrequency.FROM_1_TO_3,
  ["af4d9f76-e4d2-4e3a-a73c-d826eca11559"]: AirTravelFrequency.ABOVE_3,
  // heatSource
  ["39d83af3-8670-4ef9-a8e3-874fa22a674f"]: HeatSource.ELECTRICITY,
  ["78b57b54-3ac0-4f9f-aa76-e435db24a315"]: HeatSource.GAZ,
  ["af40ac1b-38ee-4df9-8cdc-44acafe54fed"]: HeatSource.OIL,
  // digitalIntensity
  ["1eadcb29-6e80-4655-a019-3a974bd0ed1b"]: DigitalIntensity.LIGHT,
  ["3c99eb89-7582-4466-8337-9dd708e6c297"]: DigitalIntensity.REGULAR,
  ["e293946e-9059-4e65-8f57-c890aae26353"]: DigitalIntensity.INTENSE,
  // notColdHouse
  ["0ab2fd46-d1a5-4146-85e6-22458e310141"]: YesNo.NO,
  ["6aff462c-bd4c-4792-a68d-97ca8945db11"]: YesNo.DONT_KNOW,
  ["269be021-b05c-4db8-a16f-b7f7de04ea43"]: YesNo.YES,
  // confortHouseWhenHot
  ["6d65704b-741d-43ea-95eb-de368d19b6e9"]: YesNo.NO,
  ["50c6eb94-c810-4b4e-a2f4-626216660854"]: YesNo.DONT_KNOW,
  ["40decbdf-e652-4e5b-be4e-e8d185a6808e"]: YesNo.YES,
  // ideaEasyTalk
  ["42ac7451-b383-4e78-bdb1-0820134a571a"]: YesNo.NO,
  ["c7fbc9b0-461d-4891-9f1b-de4357ddb042"]: YesNo.DONT_KNOW,
  ["5f8484ed-2fbb-41e3-b56e-504b784d1c37"]: YesNo.YES,
  // homeOccupationType
  ["e54f5fd9-fa07-41da-be7f-2ec8a9ed8e9b"]:
    HomeOccupationType.SOCIAL_HOUSING_TENANT,
  ["fe17aff4-25df-4b62-9603-482f35ff32c6"]: HomeOccupationType.HOME_OWNER,
  ["e9174667-744e-4fc7-9431-cef5f5580632"]: HomeOccupationType.HOUSING_TENANT,
  // otherHousingInformation -> (no option)
  // actionWhenTooCold
  ["93449e3b-6f5b-4e9e-ad2b-07dbb0815d79"]: ActionWhenTooCold.USE_THE_HEATING,
  ["a6320101-d3a4-4b8c-9cbc-3fa2c29faced"]: ActionWhenTooCold.USE_A_SWEATER,
  ["4a96c956-18c2-4725-9370-6246fbe1da77"]:
    ActionWhenTooCold.USE_THICK_CURTAINS,
  ["52d0b9ab-5378-4915-80d8-e08aea12801b"]: ActionWhenTooCold.CHANGE_LOCATION,
  // actionWhenTooHot
  ["3ce2e356-0042-4dd2-9007-a6be946d5df8"]: ActionWhenTooHot.OPEN_WINDOWS,
  ["e047a523-395d-487c-947b-b079ca29d097"]: ActionWhenTooHot.CLOSE_STORES,
  ["f6467ebd-4594-44d6-9fb8-bcd136284e59"]: ActionWhenTooHot.USE_A_FAN,
  ["e3daf2d3-d94c-4314-9f51-b67dde9a9639"]:
    ActionWhenTooHot.USE_AIR_CONDITIONER,
  ["15143bbd-1a91-436f-865e-6b29a8c1da65"]: ActionWhenTooHot.CHANGE_LOCATION,
  ["d5a7d207-06dc-4996-97f4-2dfebaaf2304"]: ActionWhenTooHot.ENDURE_THE_HEAT,
  ["fb59e708-92a2-47d2-aab8-4a2550bee954"]: ActionWhenTooHot.USE_SPRAYER,
  // vegetalParksSatisfaction
  ["aabd1c7d-98bb-4bc3-9d3f-359df372539c"]: YesNo.NO,
  ["99e72d0c-3f16-4fcc-a154-7bf13da0fcdc"]: YesNo.DONT_KNOW,
  ["9b4b1765-f96b-420e-a404-5989a3e7139c"]: YesNo.YES,
  // parksUsageFrequency
  ["bf8cf662-91ec-495c-8c60-c48410530983"]: ParksUsageFrequency.RARELY,
  ["5e4f5142-8487-467c-8514-272f2fcb57fb"]: ParksUsageFrequency.SOMETIMES,
  ["09739816-a47f-420a-b863-7f50afa6ad6f"]: ParksUsageFrequency.OFTEN,
  // otherParksInformation -> (no option)
  // easyPublicTransports
  ["e5d82eaa-be30-4de8-afa8-c5a154bc54dd"]: YesNo.NO,
  ["c63d67f6-f399-4230-98eb-943e2bd5806d"]: YesNo.DONT_KNOW,
  ["728f1475-4234-4674-92e5-0b14c0236e53"]: YesNo.YES,
  // easyWalking
  ["a1af9ff7-1d8b-4001-b7fd-412d252da90f"]: YesNo.NO,
  ["b7fbc7b5-ef02-4541-9b35-b180feb488ce"]: YesNo.DONT_KNOW,
  ["e90593c3-74e3-41e3-9b47-8f5d84b1a562"]: YesNo.YES,
  // easyBicycle
  ["e5894fa7-1e60-4b69-818b-61bae318bc26"]: YesNo.NO,
  ["015bbd93-31ac-410b-a678-49f82cdc1432"]: YesNo.DONT_KNOW,
  ["df1f293f-2653-4e55-97e6-3cb4496ffe45"]: YesNo.YES,
  // notTooMuchTraffic
  ["bddb474a-76a3-4e51-8e9f-b0f208950246"]: YesNo.NO,
  ["d1a63f7e-6b7b-4be5-b5af-a3c2a850cab7"]: YesNo.DONT_KNOW,
  ["4c34ce6e-7f10-4299-93d6-4f75c58cddd5"]: YesNo.YES,
  // carAnPedestriansRespect
  ["67ee593f-ca02-4e2b-8da3-5bb0da8873f6"]: YesNo.NO,
  ["cc066934-68a5-41e3-8670-6804a3a24a40"]: YesNo.DONT_KNOW,
  ["8deaf7dd-5884-454b-a8b1-4cdd362a42c2"]: YesNo.YES,
  // easyToLeaveCityWithTranports
  ["275f3e6c-f488-4abc-b55e-8cab5ba1b95f"]: YesNo.NO,
  ["cca07375-19cd-4e2e-b126-4e593b7ac49d"]: YesNo.DONT_KNOW,
  ["7e28be0c-7f76-4f21-b511-d2de3cf38e3f"]: YesNo.YES,
  // otherTransportationInformation -> (no option)
  // hardDiscountFrequency
  ["403e0438-556a-4e59-aa8f-fa38a15ab426"]: FoodFrequency.RARELY,
  ["5fbb76d0-0700-4ae1-ab59-b23e70d91148"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["8adf9038-5e96-473e-a37a-2066b44ccf9a"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["0839c84d-48af-41a5-a940-2cc652928756"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // supermarketFrequency
  ["fa6b468e-5f70-4980-b3c7-fe7115170f34"]: FoodFrequency.RARELY,
  ["a10e97fa-a253-4e88-8d1e-efeb9f29556b"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["31f24647-2acb-4ebd-ac3a-8940cc782f2c"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["2ecce338-66f9-46c5-a2ae-559cb8d0e725"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // hypermarketFrequency
  ["cf487575-98d1-4f4f-90e0-b98037b478c7"]: FoodFrequency.RARELY,
  ["5ba58c46-de19-4fb7-82e2-f35af472dcbb"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["d7fab02d-c0fe-4faa-b043-b01d8254e798"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["bbe03998-4b93-45aa-8286-97a232d8f9b3"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // groceryStoreFrequency
  ["ea34fc62-8168-4dd6-9831-0b8ca2732b95"]: FoodFrequency.RARELY,
  ["05520b8a-3022-48fd-ac32-243743e2a6d5"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["52a357f0-919b-409e-8337-e70a0f31abe8"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["31682eb8-5ab1-46bb-a966-c2a354fed9e9"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // specializedFoodStoreFrequency
  ["fe02ec15-7518-439a-b064-33fa8c66ea37"]: FoodFrequency.RARELY,
  ["66e64b66-8894-4792-9f3a-07db7b7ffbd7"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["6b3b4c6e-60df-4fae-ad19-a9827c2ea8e3"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["34bb1eea-60d8-42f1-a77f-cc225529462b"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // organicOrSolidarityFoodStoreFrequency
  ["9343ec3e-1095-4eda-b0c6-30423278a1ba"]: FoodFrequency.RARELY,
  ["7edf53b4-d253-4d19-bc75-e599e5d2bc0d"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["10b37c02-7db2-46f3-9139-5266e8318323"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["20c53bac-a978-4626-b0df-4ddce19e7ff5"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // homeDeliveryFoodStoreFrequency
  ["8cb20ff8-1450-417e-aa04-4dff58692371"]: FoodFrequency.RARELY,
  ["6788c4f1-414a-49a8-9e02-5cd52979a237"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["6dd0c542-ba00-4bfd-a010-19bbe55a3df8"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["696e961c-fd5c-4141-a9e4-c6ffbcd457d6"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // classicFoodMarketFrequency
  ["185b37c4-d822-4a0a-91ec-b5d79341aa65"]: FoodFrequency.RARELY,
  ["fb9c7569-0f61-494b-80b1-34bc76971981"]:
    FoodFrequency.LESS_THAN_ONCE_A_MONTH,
  ["8cc648ab-022e-4f82-be66-70f3ed7f7486"]:
    FoodFrequency.BETWEEN_ONE_AND_THREE_BY_MONTH,
  ["f050432f-b4c5-458b-91ab-54cb890a0521"]: FoodFrequency.MORE_THAN_ONCE_A_WEEK,
  // otherFoodFrequencyInformation -> (no option)
  // typeOfFood
  ["9f5b7866-c123-434a-8f8e-af3824e00efe"]: TypeOfFood.OWN_PREPARATION,
  ["1a654851-ec4b-4518-893c-905bf5487e21"]: TypeOfFood.INDUSTRIAL_PREPARATION,
  ["7f4277ce-c9e7-43cf-a11d-a7a82e39e73c"]: TypeOfFood.MIXED,
  // neighborhoodOrganicMarketSatisfaction
  ["5ed71d40-7ae2-46e8-98e6-dc6d2e64522e"]: YesNo.NO,
  ["6509c4e6-d18c-4a18-8fc9-430946ccafed"]: YesNo.DONT_KNOW,
  ["b57d920d-c5c8-4d40-9044-dc4c6ed7e4c1"]: YesNo.YES,
  // neighborhoodSeasonFruitAndVegetablesSatisfaction
  ["6323b739-77b2-4570-be35-470cb7b5b4d0"]: YesNo.NO,
  ["8d49f64c-d9dc-4ec6-90e6-b0ffa9fb0b5a"]: YesNo.DONT_KNOW,
  ["747f650a-3a1b-43b0-bfec-7fe569c0e938"]: YesNo.YES,
  // neighborhoodOrganicProductsSatisfaction
  ["576b9e6c-b790-49d3-8c48-6ee8fd7a3987"]: YesNo.NO,
  ["cdacac58-11f5-4a8c-a30c-1fd71a6c29c1"]: YesNo.DONT_KNOW,
  ["9b045e63-0903-4cca-aa00-1e06468ac9a9"]: YesNo.YES,
  // privateOrShareFieldToFarm
  ["2efcff2f-ec5f-49a5-94f8-aeb26c4be5d0"]: YesNo.NO,
  ["69c810da-4ffb-48dd-8697-3faaa20abbde"]: YesNo.DONT_KNOW,
  ["631080b8-d077-40d9-85a0-264c034b352a"]: YesNo.YES,
  // accessToFoodServiceSatisfaction
  ["ab14cf81-4314-421d-a1d5-93d6dcea2803"]: YesNo.NO,
  ["8e67c5e4-b3bc-4fd3-9cce-0ce0860189ea"]: YesNo.DONT_KNOW,
  ["f833fa78-64d5-48b1-bf29-eb55ba5d5c44"]: YesNo.YES,
  // accessToShortFoodCircuitSatisfaction
  ["089134ab-fb5e-472e-8eeb-686278c97fe7"]: YesNo.NO,
  ["4684c230-a57f-4229-b5c3-d9dfb9d362a4"]: YesNo.DONT_KNOW,
  ["5f6b598c-0174-462d-bfcc-24fc13702470"]: YesNo.YES,
  // otherFoodSatisfactionInformation -> (no option)
  // electronicRepairShopSatisfaction
  ["3d33ac6a-bda0-4551-92b8-0031b1db90ea"]: YesNo.NO,
  ["015a17d4-8152-4dd2-bb73-194943849ae5"]: YesNo.DONT_KNOW,
  ["962eb580-2ae8-4f4d-91f3-fdf58505d713"]: YesNo.YES,
  // clothesRepairShopSatisfaction
  ["c3fe7674-4ca6-4e08-bab4-2aeaf2e7b067"]: YesNo.NO,
  ["b39d453e-fa18-4200-bc82-6354dcea1692"]: YesNo.DONT_KNOW,
  ["f326615c-d25c-4dcb-8a73-b1d392c310fc"]: YesNo.YES,
  // bicycleRepairShopSatisfaction
  ["8fe1bf31-553a-44dc-98e7-41c55345fcbd"]: YesNo.NO,
  ["56798ecb-e05c-4b6a-bfe9-23804bce3cca"]: YesNo.DONT_KNOW,
  ["d5b0cc1c-4f9a-4b65-902e-84c2f3e3c6e3"]: YesNo.YES,
  // secondHandShopSatisfaction
  ["899f5e29-30f9-4045-afc4-5c9c7eb61151"]: YesNo.NO,
  ["71903775-01eb-4f5e-ac37-4657e4a3465c"]: YesNo.DONT_KNOW,
  ["050ec3a8-49eb-4188-8245-7d026219e4ed"]: YesNo.YES,
  // otherRepairShopSatisfactionInformation -> (no option)
  // localShopsToMeetYourNeeds
  ["59a68992-d20a-4106-88a0-42702e334ae2"]: YesNo.NO,
  ["7bd4f1c1-96fb-4154-bb07-e4df7f93b183"]: YesNo.DONT_KNOW,
  ["6ec89018-47ca-417a-be18-157ce7bf3794"]: YesNo.YES,
  // servicesToShareOrRentObjects
  ["b5b1116c-97d3-41f5-b0ad-b86c13c96f39"]: YesNo.NO,
  ["21298551-90f3-48be-a6eb-3f0c05ad2231"]: YesNo.DONT_KNOW,
  ["8524323d-5f3f-4819-ad84-e1c7055f8450"]: YesNo.YES,
  // publicServicesPresence
  ["d9cfe740-d266-4ce9-8382-588b052a59ee"]: YesNo.NO,
  ["e2778b45-0a24-4311-8262-17942505ae07"]: YesNo.DONT_KNOW,
  ["380282ad-d8d9-4bf0-bb66-0d3f9a63abe8"]: YesNo.YES,
  // otherServicesInformation -> (no option)
  // associativeActivity
  ["f0d5ae60-8548-4a24-8f58-e8cec47c3a0d"]: YesNo.NO,
  ["54cad822-5b49-4520-907b-a605cfaba1fa"]: YesNo.DONT_KNOW,
  ["f5410c6c-71be-4aa3-85bd-a285021c093d"]: YesNo.YES,
  // culturalActivity
  ["21127b62-c68c-455d-88ad-7abdb25081a6"]: YesNo.NO,
  ["a93b454a-364d-485a-aba0-8305207f667a"]: YesNo.DONT_KNOW,
  ["4c01a73c-a562-4173-b6ef-9879c3922f50"]: YesNo.YES,
  // hobbiesSpaces
  ["e50198f2-cb36-472e-84ce-e46e7e218ebe"]: YesNo.NO,
  ["2d2feac2-9efc-4b9c-a80b-9779e4e39209"]: YesNo.DONT_KNOW,
  ["67894f99-f7af-4925-9848-3d9d7f00ee3d"]: YesNo.YES,
  // neighborhoodLife
  ["12aa8fcc-259f-4c51-87bc-1ff34e0fdbe4"]: YesNo.NO,
  ["ddf2f9a6-af89-44b3-a05b-b64278503c91"]: YesNo.DONT_KNOW,
  ["5b6a495a-c5dc-48c8-87c1-689324fc2181"]: YesNo.YES,
  // otherNeighborhoodLifeInformation -> (no option)
  // howManyPeopleCanIHelp
  ["05333e51-ec4c-4140-a7ef-529a11e3f9a2"]: HowManyPeopleCanIHelp.ZERO,
  ["d1cec1c3-fdf2-4b63-b7e0-1f077553b8b2"]: HowManyPeopleCanIHelp.ONE_TO_TWO,
  ["64683c9e-6a39-4be7-9c43-d69571dbb198"]: HowManyPeopleCanIHelp.THREE_TO_FOUR,
  ["f40043d2-ad1b-49c2-8193-62888f97d1ad"]: HowManyPeopleCanIHelp.ABOVE_FIVE,
  // otherMutualAidInformation -> (no option)
  // capacityToShareIdeaToTownHall
  ["cbdcb28c-9b4c-402e-86e5-97de27357ba7"]: YesNo.NO,
  ["79c8574f-9e22-45f2-8f73-db86688a40a2"]: YesNo.DONT_KNOW,
  ["8c25942f-57ac-4f09-ae90-c9046c74db59"]: YesNo.YES,
  // noInformationOnCitizenParticipation
  ["9fc44585-bbe9-4644-b412-b3293bec22c9"]: YesNo.NO,
  ["bb87ceb7-6396-4a2f-ab7a-06c559ad3779"]: YesNo.DONT_KNOW,
  ["55491c70-9ec0-4222-a53e-4be21737d0c4"]: YesNo.YES,
  // wantToParticipateToCivicInitiatives
  ["176d48a7-25b3-4718-8793-0f8d4b450a64"]: YesNo.NO,
  ["d47ad3e7-e820-474a-bb9a-a57a82b73abd"]: YesNo.DONT_KNOW,
  ["9046fbc0-df90-4481-9a89-a7ed96e51134"]: YesNo.YES,
  // otherLocalPoliticInformation -> (no option)
  // giveFreeTimeToHelp
  ["7b692dd9-6ce4-483d-a19a-723058d624ee"]: GiveFreeTimeToHelp.YES_OFTEN,
  ["7bc4944c-f2f7-4242-a570-b156efcddc55"]: GiveFreeTimeToHelp.YES_SOMETIMES,
  ["1cd31637-7811-44c4-8c6b-74c73a0a3c4f"]: GiveFreeTimeToHelp.NO_BUT_I_WISH,
  ["f1f6fc0e-6f68-4d5f-88e0-dab441456daf"]: GiveFreeTimeToHelp.NO_I_CANT,
  // yourVoluntaryWork
  ["4bc12402-7298-46b0-a465-eec4b08afb06"]: VoluntaryWork.HUMAN_AND_SOCIAL,
  ["aed85813-9f42-448a-b84f-4b2a128bc854"]: VoluntaryWork.YOUTH_AND_EDUCATION,
  ["2427a1ca-a2c5-417f-a082-9813b1b6ce47"]: VoluntaryWork.CULTURE,
  ["9742d9f4-d711-435e-983a-eb39408de4b7"]: VoluntaryWork.SPORTS,
  ["10957249-7d67-4104-a33f-6d461d7760db"]: VoluntaryWork.ENVIRONMENT,
  ["0f5785cf-6deb-47c2-a714-882a19bc3cea"]: VoluntaryWork.POLITIC,
  // wantToReduceCarUsage
  ["504cce34-8773-4628-8096-365c49700d9a"]: WishesChoices.NO,
  ["592b24c7-cb1c-45da-967c-adc2a04954de"]: WishesChoices.I_WISH_BUT_CANT,
  ["7fcb5511-7a9c-465c-bc41-3851dad25c2d"]: WishesChoices.I_WISH_AND_IT_IS_PLAN,
  ["a5e521a8-7d84-4c9e-a575-75821de6e961"]: WishesChoices.YES_I_DO,
  ["74f7bdf7-378b-47c5-8c60-0fdd34799f1a"]: WishesChoices.NOT_CONCERNED,
  // reasonsToContinueUsingCar
  ["0aafc218-3b2d-43e5-9c37-628fe8e9e4bb"]: ReasonsUsingCar.HANDICAP_REASONS,
  ["24e32b3a-d36b-456b-9cdf-dd7c5daa1923"]:
    ReasonsUsingCar.I_NEED_CAR_FOR_SOME_ACTIONS,
  ["358956c1-900c-44c8-945e-e1935a315411"]: ReasonsUsingCar.SECURITY_REASONS,
  ["111b33e8-2fd5-4b70-ad79-8b351fa081e2"]: ReasonsUsingCar.MY_WORK,
  ["51112c7c-d014-4966-8113-22e756602bf1"]:
    ReasonsUsingCar.PROFESSIONAL_OR_PERSONAL_IMAGE,
  ["d80e21f5-3b05-4ad0-ac44-52b7ecdb6729"]:
    ReasonsUsingCar.CONFORT_OR_INDEPENDANCE,
  ["5782344a-1bdf-48b0-adc8-aff1b7aefe77"]:
    ReasonsUsingCar.NO_PUBLIC_TRANSPORT_AT_PROXIMITY,
  // wantToReduceMeatAndFish
  ["2519df27-2512-47d6-af4a-cae7b69b5942"]: WishesChoices.NO,
  ["94e6f94d-6f69-4577-ad94-a22dbe1c710d"]: WishesChoices.I_WISH_BUT_CANT,
  ["5512113f-55ac-4539-9f97-2d944ca2b05b"]: WishesChoices.I_WISH_AND_IT_IS_PLAN,
  ["8f1d0428-46ec-4471-84a4-abb277b43777"]: WishesChoices.YES_I_DO,
  ["0c7d0555-99f4-4f0c-9d83-f4c06b67a950"]: WishesChoices.NOT_CONCERNED,
  // reasonsToEatMeat
  ["f8978189-874b-4601-9657-a06b4b159bbf"]:
    ReasonsToEatMeat.WITHOUT_MEAT_IS_NOT_NOURISHING_ENOUGH,
  ["b1dc4abf-d98e-469b-97fe-3a1d27654ca5"]: ReasonsToEatMeat.MY_FAMILY_EAT_MEAT,
  ["8bf01a9d-c798-45ed-9776-ce573106f057"]:
    ReasonsToEatMeat.I_DONT_KNOW_ALTERNATIVES,
  ["e1c60d76-cfaf-459f-9259-caf91f9a47dd"]:
    ReasonsToEatMeat.I_DONT_TRUST_ALTERNATIVES,
  ["d6b7adf7-f3dc-43c2-8d3f-d43db195e405"]:
    ReasonsToEatMeat.RESTAURANTS_DOES_NOT_OFFER_ALTERNATIVES,
  // preferBuyFrenchAndSeasonFood
  ["1762c8bc-820a-4216-a1fa-39c93738dd24"]: WishesChoices.NO,
  ["09dc5f65-e732-45ba-9a21-906c2a03653d"]: WishesChoices.I_WISH_BUT_CANT,
  ["8aefac33-08c8-40a9-a399-9bad1f15ac35"]: WishesChoices.I_WISH_AND_IT_IS_PLAN,
  ["b3bd222a-d6ac-4eaf-9d48-fd1511d9ac0b"]: WishesChoices.YES_I_DO,
  ["5f30d09d-f9df-41f1-adcb-eddced3f5a73"]: WishesChoices.NOT_CONCERNED,
  // reasonsToNotBuyFrenchAndSeasonFood
  ["d602ad0c-8eff-41f0-be83-291c614e6674"]:
    ReasonsToNotBuyFrenchSeasonFood.PRICE,
  ["f2a474d1-51d6-4b55-b60b-8aaed457194b"]:
    ReasonsToNotBuyFrenchSeasonFood.COMPLICATED_LABELS,
  ["0f931014-f4a6-4c1c-89c1-e3f4bb8c9452"]:
    ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_MARKET,
  ["dca6d912-d32b-486d-8096-0ac5acdbcfd5"]:
    ReasonsToNotBuyFrenchSeasonFood.I_PREFER_INDUSTRIAL_FOOD,
  ["ae140548-ab4d-4cd0-9a1b-13c1a0afa3bf"]:
    ReasonsToNotBuyFrenchSeasonFood.I_DONT_KNOW_SEASON_PRODUCTS,
  ["5df09cde-db7a-4651-bbec-a09f08019762"]:
    ReasonsToNotBuyFrenchSeasonFood.I_PREFER_EAT_OTHER_PRODUCTS,
  // preferSecondHand
  ["470dfcfc-d65a-4695-937d-31137c0d248a"]: WishesChoices.NO,
  ["4703fcda-3826-4792-9249-e1e18fa0a24a"]: WishesChoices.I_WISH_BUT_CANT,
  ["132aedf3-42de-4ef1-ab6b-883607d3b99a"]: WishesChoices.I_WISH_AND_IT_IS_PLAN,
  ["bd581dcd-4155-40b5-9344-494ad83e1d10"]: WishesChoices.YES_I_DO,
  ["3661c111-299a-4d64-a2aa-a685507e6e69"]: WishesChoices.NOT_CONCERNED,
  // reasonsToNotChoseSecondHand
  ["18b7b150-6cee-4e33-b395-e2ed2ca97869"]: ReasonsToNotChoseSecondHand.TRUST,
  ["1c5592a2-5436-4c8d-b2bd-7ba5a1b81e17"]:
    ReasonsToNotChoseSecondHand.TIME_CONSUMING,
  ["134374b7-d97e-484a-8b87-36b1235e0372"]:
    ReasonsToNotChoseSecondHand.PROFESSIONAL_OR_PERSONAL_IMAGE,
  ["4ef967c4-7de6-4f5c-93df-5dde9936156d"]:
    ReasonsToNotChoseSecondHand.COMPETENCIES,
  ["40958a9a-44f0-488e-ad5e-0c5174a7cd0f"]:
    ReasonsToNotChoseSecondHand.NO_OFFER_AT_PROXIMITY,
  // transportModeToBuyFood
  ["9ac918ba-9f5b-4992-9f5f-cd9e791d7867"]: TransportMode.WALKING,
  ["e521a754-65d0-48c8-bb01-8d61e9c04281"]: TransportMode.PERSONAL_BICYCLE,
  ["866a876c-d3dc-455a-aef9-a69e82cc6ed5"]: TransportMode.SHARED_BICYCLE,
  ["1f6c99d8-ff8c-4b1e-8bfd-09f3b0335661"]: TransportMode.PUBLIC_TRANSPORT,
  ["357a082c-b948-4d59-a442-c31c210ccb8b"]: TransportMode.CAR,
  ["7dd17d00-e81f-4e97-8731-84ffa05a30ee"]: TransportMode.ELECTRIC_CAR,
  ["2ed20d4a-f766-42ff-bd41-ac5a2d560750"]: TransportMode.TAXI_VTC,
  ["d5a76a66-0b4a-407d-8201-12c764bc1b9e"]: TransportMode.NONE_I_DONT_MOVE,
  // transportTimeToBuyFood
  ["c75d24e8-dc05-45c5-b4a6-1963aa57835f"]: TransportTime.LESS_THAN_10_MIN,
  ["aaa41c73-8446-4bc1-8b0a-ed148c271128"]: TransportTime.BETWEEN_10_AND_20_MIN,
  ["e42164f3-9f3a-4df7-b030-2e49758c0209"]: TransportTime.BETWEEN_20_AND_30_MIN,
  ["919619bc-67ec-45e7-86b7-3389ab48fd1d"]: TransportTime.BETWEEN_30_AND_45_MIN,
  ["64fee89b-2ee0-4732-a61a-46e21ac16324"]: TransportTime.ABOVE_45_MIN,
  // foodMarketZone
  ["e26e881e-1020-43de-bed8-1514bda6052b"]: ZoneSelection.ZONE_A,
  ["e62c8117-73a5-427e-a54f-1ca8f52f05a7"]: ZoneSelection.ZONE_B,
  ["e8664932-6e40-4a95-a2d4-64f3aac8e978"]: ZoneSelection.ZONE_C,
  ["c5c7e26c-debe-4035-aee2-021ed473e76b"]: ZoneSelection.ZONE_D,
  ["783f80db-54a7-43cb-9b74-2a65d2cef45b"]: ZoneSelection.ZONE_PORTE_ORLEANS,
  // transportModeToHobby
  ["fac71077-f5fe-43fb-b174-82e8a249663e"]: TransportMode.WALKING,
  ["832528fb-4f64-485c-b5ca-cbe51508792e"]: TransportMode.PERSONAL_BICYCLE,
  ["29c7bad8-503c-4cea-b939-08c9a5b0fcd4"]: TransportMode.SHARED_BICYCLE,
  ["e79a3b7f-6fd1-4aa6-917c-cb2e61941809"]: TransportMode.PUBLIC_TRANSPORT,
  ["d542b49e-e11b-4069-ad77-58a1f26bcdfb"]: TransportMode.CAR,
  ["cffc78ce-224b-400b-8b43-04a221d8bd8d"]: TransportMode.ELECTRIC_CAR,
  ["a3d21813-68e9-43f6-bae0-155ad0ebd088"]: TransportMode.TAXI_VTC,
  ["88caadf9-157e-4ddf-a3f4-5614b3e631b6"]: TransportMode.NONE_I_DONT_MOVE,
  // transportTimeToHobby
  ["4c22cda0-47eb-4b70-abe6-abfc154fea6a"]: TransportTime.LESS_THAN_10_MIN,
  ["e538d138-8402-42a5-8924-a359d4d0085a"]: TransportTime.BETWEEN_10_AND_20_MIN,
  ["96114865-ed4f-452d-84a0-fc19624e406d"]: TransportTime.BETWEEN_20_AND_30_MIN,
  ["f7778f26-ab4d-4786-9096-08c281fce2c5"]: TransportTime.BETWEEN_30_AND_45_MIN,
  ["548122b2-f2af-47a3-b0ee-87d8a876c405"]: TransportTime.ABOVE_45_MIN,
  // hobbyZone
  ["7a84ef51-e0fb-4c33-afee-77117f46cac6"]: ZoneSelection.ZONE_A,
  ["ab29dd44-8e55-49a1-9d68-67285d617b7f"]: ZoneSelection.ZONE_B,
  ["174d42cc-1b6c-49b8-b483-38601425f28f"]: ZoneSelection.ZONE_C,
  ["0717cfad-9fa5-4dad-a3b8-ce90b037dd73"]: ZoneSelection.ZONE_D,
  ["44c07993-0f36-4152-9020-ae579c0b256b"]: ZoneSelection.ZONE_PORTE_ORLEANS,
  // remoteWorkingWeeklyFrequency -> (opinion_scale)
  // transportModeToWork
  ["5458fc0a-bc52-4ef2-97ba-613862c46079"]: TransportMode.WALKING,
  ["f83bd7f7-8f1a-4ae8-861d-8a68a94c25a2"]: TransportMode.PERSONAL_BICYCLE,
  ["7b63041e-a013-4f6e-8b35-bebde69b9f13"]: TransportMode.SHARED_BICYCLE,
  ["58d627d2-8dd7-4bcf-81c3-0eafd9274a57"]: TransportMode.PUBLIC_TRANSPORT,
  ["7eae6b82-81b1-4a7e-9e0e-6c769f2bd36a"]: TransportMode.CAR,
  ["af303c34-37a0-4c65-b0a1-7d036b46d6ee"]: TransportMode.ELECTRIC_CAR,
  ["b8c58e96-9681-426c-a71f-eb62b326475a"]: TransportMode.TAXI_VTC,
  ["b39b9e12-3512-424f-a515-a1d4aaa1ac10"]: TransportMode.NONE_I_DONT_MOVE,
  // transportTimeToWork
  ["7ad77644-9907-4255-beba-f92d1f906e37"]: TransportTime.LESS_THAN_10_MIN,
  ["c4a4fc45-d6f7-45d6-97e3-75c2f9a55936"]: TransportTime.BETWEEN_10_AND_20_MIN,
  ["85ae3eab-7bee-462d-8963-69d8c5927466"]: TransportTime.BETWEEN_20_AND_30_MIN,
  ["f7fe9818-0973-4ccd-9514-981632480471"]: TransportTime.BETWEEN_30_AND_45_MIN,
  ["488a72a6-f779-45e6-92fc-14e687fb8c94"]: TransportTime.ABOVE_45_MIN,
  // workZone
  ["da377179-5f4c-4d16-bce0-6f9763d0f595"]: ZoneSelection.ZONE_A,
  ["238e3e22-855f-418b-959d-a011a95340e4"]: ZoneSelection.ZONE_B,
  ["8318aabc-bb97-46e3-bdab-5aa24539825f"]: ZoneSelection.ZONE_C,
  ["cae0f28c-799f-449c-9eb5-22b58d00f710"]: ZoneSelection.ZONE_D,
  ["0fdf04f7-411a-4db1-b5c3-29e4c7f1fc18"]: ZoneSelection.ZONE_PORTE_ORLEANS,
  // transportModeToTravel
  ["0bebf356-b5bd-435a-b5c4-c50dbc4914c4"]:
    TransportModeToTravel.PUBLIC_TRANSPORT,
  ["e2c7e519-90e8-4457-a3bf-0e6ac420bda2"]: TransportModeToTravel.TRAIN,
  ["57f82193-a47b-4e90-89b4-3292bd4faa84"]: TransportModeToTravel.PLANE,
  ["8c0c002c-facd-41dd-adf4-ec091adc5b13"]: TransportModeToTravel.CAR,
  ["223cf0aa-8195-4813-aa20-2c90f67a80dc"]: TransportModeToTravel.ELECTRIC_CAR,
  ["d9a0d0b2-2404-4a24-a95d-f8866a0d9efb"]: TransportModeToTravel.TAXI_VTC,
  ["cdac0e9b-2b45-462e-a61e-fc02c74a3123"]: TransportModeToTravel.BICYCLE,
  ["69604682-fbc8-446f-9090-cdeb244a63f7"]: TransportModeToTravel.WALKING,
  ["70b572e0-b627-4b1f-96c6-e248961995a2"]: TransportModeToTravel.BUS,
  // transportModeToGoToStation
  ["20062b5c-32fe-45b9-be0b-dd9eb54b2aa5"]:
    TransportModeToStation.PUBLIC_TRANSPORT,
  ["6784a680-794f-40d6-8aab-4e91abef9028"]: TransportModeToStation.CAR,
  ["fc6ef6b9-a3a8-44b0-ad35-5e7b41c8785c"]: TransportModeToStation.ELECTRIC_CAR,
  ["ad9b8d8a-8aa9-4d06-ba3f-5e87569a8f0f"]: TransportModeToStation.TAXI_VTC,
  ["d690e5b9-1684-4a8a-9cb6-e0dbc0cffd53"]: TransportModeToStation.BICYCLE,
  ["5c30f38d-cc9d-4d52-b507-91553bb87bce"]: TransportModeToStation.WALKING,
  ["2f56e0a3-ba76-4ece-b4b9-33c698d91036"]:
    TransportModeToStation.DONT_USE_STATION,
  // email -> (no option)
  // comment -> (no option)
};

export const getReferencesMapping = (
  typeformType: TypeformType,
): Record<string, string | boolean> => {
  return typeformType === TypeformType.SU
    ? surveySUReferencesMapping
    : surveyWayOfLifeReferencesMapping;
};

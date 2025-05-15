import {
  AirTravelFrequency,
  DigitalIntensity,
  HeatSource,
  MeatFrequency,
  PurchasingStrategy,
  TransportationMode,
} from "@prisma/client";
import {
  type ConvertedCarbonFootprintAnswer,
  type NgcWebhookPayload,
} from "~/types/CarbonFootprint";

export const convertCarbonFootprintBody = (
  body: NgcWebhookPayload,
): ConvertedCarbonFootprintAnswer => {
  return {
    alimentation: body.calculatedResults.alimentation,
    alimentationAnnualBreakfast:
      body.calculatedResults["alimentation . petit déjeuner annuel"],
    alimentationBonus: body.calculatedResults["alimentation . bonus"],
    alimentationColdDrinks:
      body.calculatedResults["alimentation . boisson . froide"],
    alimentationDeforestation:
      body.calculatedResults["alimentation . déforestation"],
    alimentationDrinks: body.calculatedResults["alimentation . boisson"],
    alimentationHotDrinks:
      body.calculatedResults["alimentation . boisson . chaude"],
    alimentationLocalConsumption:
      body.calculatedResults["alimentation . local . consommation"],
    alimentationLocalImpact:
      body.calculatedResults["alimentation . local . empreinte"],
    alimentationLunchDinner:
      body.calculatedResults["alimentation . déjeuner et dîner"],
    alimentationMeals: body.calculatedResults["alimentation . repas"],
    alimentationSeasonalImpact:
      body.calculatedResults["alimentation . de saison . empreinte"],
    alimentationWaste: body.calculatedResults["alimentation . déchets"],
    alimentationWasteHabits:
      body.calculatedResults["alimentation . déchets . gestes"],
    answers: { ...body.answers.userAnswers, ...body.answers.voitures },
    divers: body.calculatedResults.divers,
    diversDigital: body.calculatedResults["divers . numérique"],
    diversDigitalDevices:
      body.calculatedResults["divers . numérique . appareils"],
    diversDigitalInternet:
      body.calculatedResults["divers . numérique . internet"],
    diversFurniture: body.calculatedResults["divers . ameublement"],
    diversFurnitureDeforestation:
      body.calculatedResults["divers . ameublement . déforestation"],
    diversFurnitureItems:
      body.calculatedResults["divers . ameublement . meubles"],
    diversFurniturePreservation:
      body.calculatedResults["divers . ameublement . préservation"],
    diversHouseholdAppliances:
      body.calculatedResults["divers . électroménager"],
    diversHouseholdAppliancesDevices:
      body.calculatedResults["divers . électroménager . appareils"],
    diversTextile: body.calculatedResults["divers . textile"],
    globalNote: body.calculatedResults.bilan,
    logement: body.calculatedResults.logement,
    logementAirConditioning: body.calculatedResults["logement . climatisation"],
    logementConstruction: body.calculatedResults["logement . construction"],
    logementConstructionBase:
      body.calculatedResults["logement . construction . base"],
    logementConstructionCooling:
      body.calculatedResults["logement . construction . rafraichissement"],
    logementConstructionDeforestation:
      body.calculatedResults["logement . construction . déforestation"],
    logementConstructionRenovation:
      body.calculatedResults["logement . construction . rénovation"],
    logementConstructionSoilArtificialization:
      body.calculatedResults[
        "logement . construction . artificialisation sols"
      ],
    logementElectricity: body.calculatedResults["logement . électricité"],
    logementElectricityCarbonIntensity:
      body.calculatedResults[
        "logement . électricité . intensité carbone équivalente"
      ],
    logementElectricitySolarAutoconsumption:
      body.calculatedResults[
        "logement . électricité . photovoltaique . autoconsommation"
      ],
    logementElectricityTotalConsumption:
      body.calculatedResults["logement . électricité . consommation totale"],
    logementHeating: body.calculatedResults["logement . chauffage"],
    logementHollidays: body.calculatedResults["logement . vacances"],
    logementHollidaysCampingImpact:
      body.calculatedResults["logement . vacances . empreinte camping"],
    logementHollidaysHomeExchangeImpact:
      body.calculatedResults["logement . vacances . empreinte échange"],
    logementHollidaysHotelImpact:
      body.calculatedResults["logement . vacances . empreinte hotel"],
    logementHollidaysRentalImpact:
      body.calculatedResults["logement . vacances . empreinte locations"],
    logementHollidaysSecondaryHomeImpact:
      body.calculatedResults[
        "logement . vacances . empreinte résidence secondaire"
      ],
    logementHollidaysYouthHostelImpact:
      body.calculatedResults[
        "logement . vacances . empreinte auberge de jeunesse"
      ],
    logementOutdor: body.calculatedResults["logement . extérieur"],
    logementSwimmingPool: body.calculatedResults["logement . piscine"],
    servicesMarket: body.calculatedResults["services marchands"],
    servicesPublics: body.calculatedResults["services publics"],
    servicesSocietal: body.calculatedResults["services sociétaux"],
    transportation: body.calculatedResults.transport,
    transportationBicycle: body.calculatedResults["transport . deux roues"],
    transportationCar: body.calculatedResults["transport . voiture"],
    transportationCarElectricConsumption100:
      body.calculatedResults[
        "transport . voiture . électrique . consommation aux 100"
      ],
    transportationCarKm2: body.calculatedResults["transport . voiture . km2"],
    transportationCarLongDistance:
      body.calculatedResults["transport . car longue distance"],
    transportationCarOilConsumption100:
      body.calculatedResults[
        "transport . voiture . thermique . consommation aux 100"
      ],
    transportationCarOilType: body.calculatedResults[
      "transport . voiture . thermique . carburant"
    ]
      ? String(
          body.calculatedResults["transport . voiture . thermique . carburant"],
        )
      : "",
    transportationFerry: body.calculatedResults["transport . ferry"],
    transportationHollidays: body.calculatedResults["transport . vacances"],
    transportationHollidaysCampingCar:
      body.calculatedResults["transport . vacances . camping car"],
    transportationHollidaysCaravan:
      body.calculatedResults["transport . vacances . caravane"],
    transportationHollidaysCruise:
      body.calculatedResults["transport . vacances . croisière"],
    transportationHollidaysRentalVehicle:
      body.calculatedResults["transport . vacances . location véhicule "],
    transportationHollidaysVan:
      body.calculatedResults["transport . vacances . van"],
    transportationPlane: body.calculatedResults["transport . avion"],
    transportationPublicTransport:
      body.calculatedResults["transport . transports commun"],
    transportationSoftMobility:
      body.calculatedResults["transport . mobilité douce"],
    transportationTrain: body.calculatedResults["transport . train"],

    neighborhood: body.neighborhoodId,
    broadcastChannel: body.broadcastChannel,

    knowSu: mapConnaissanceSu(
      body.answers.userAnswers["services sociétaux . connaissance su"],
    ),
    su: mapSu(body.answers.userAnswers["services sociétaux . su . choix"]),

    airTravelFrequency: mapAirTravelFrequency(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 5"
      ],
    ),

    heatSource: mapHeatSource(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 6"
      ],
    ),
    meatFrequency: mapMeatFrequency(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 1"
      ],
    ),

    transportationMode: mapTransportationMode(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 2"
      ],
    ),
    digitalIntensity: mapDigitalIntensity(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 3"
      ],
    ),
    purchasingStrategy: mapPurchasingStrategy(
      body.answers.userAnswers[
        "services sociétaux . su . calcul su . question 4"
      ],
    ),
  };
};

export const ConnaissanceSuEnumInput = {
  oui: true,
  non: false,
};

export type ConnaissanceSuEnumKey = keyof typeof ConnaissanceSuEnumInput;

const mapConnaissanceSu = (key: string | undefined): boolean => {
  return !!key && key in ConnaissanceSuEnumInput
    ? ConnaissanceSuEnumInput[key as keyof typeof ConnaissanceSuEnumInput]
    : false;
};

// manually map ngc su names to su ids
export const SuMapEnum = {
  "'SU 1'": 1,
  "'SU 2'": 2,
  "'SU 3'": 3,
  "'SU 4'": 4,
  "'SU 5'": 5,
  "'SU 6'": 6,
};

const mapSu = (key: string | undefined): number | undefined => {
  return key ? SuMapEnum[key as keyof typeof SuMapEnum] : undefined;
};

export const MeatFrequencyEnumInput = {
  "'moyen'": "'moyen'",
  "'faible'": "'faible'",
  "'beaucoup'": "'beaucoup'",
};

const MeatFrequencyEnum = {
  "'moyen'": MeatFrequency.REGULAR,
  "'faible'": MeatFrequency.MINOR,
  "'beaucoup'": MeatFrequency.MAJOR,
};
export type MeatFrequencyKey = keyof typeof MeatFrequencyEnum;

const mapMeatFrequency = (
  key: string | undefined,
): MeatFrequency | undefined =>
  key ? MeatFrequencyEnum[key as MeatFrequencyKey] : undefined;

export const TransportationModeEnumInput = {
  "'voiture'": "'voiture'",
  "'transports en commun'": "'transports en commun",
  "'marche vélo trottinette'": "'marche vélo trottinette'",
};

const TransportationModeEnum = {
  "'voiture'": TransportationMode.CAR,
  "'transports en commun'": TransportationMode.PUBLIC,
  "'marche vélo trottinette'": TransportationMode.LIGHT,
};

type TransportationModeKey = keyof typeof TransportationModeEnum;

const mapTransportationMode = (
  key: string | undefined,
): TransportationMode | undefined =>
  key ? TransportationModeEnum[key as TransportationModeKey] : undefined;

export const GradationEnumInput = {
  "'moyen'": "'moyen'",
  "'faible'": "'faible'",
  "'beaucoup'": "'beaucoup'",
};

const DigitalIntensityEnum = {
  "'moyen'": DigitalIntensity.REGULAR,
  "'faible'": DigitalIntensity.LIGHT,
  "'beaucoup'": DigitalIntensity.INTENSE,
};

type DigitalIntensityKey = keyof typeof DigitalIntensityEnum;

const mapDigitalIntensity = (
  key: string | undefined,
): DigitalIntensity | undefined =>
  key ? DigitalIntensityEnum[key as DigitalIntensityKey] : undefined;

export const PurchasingStrategyEnumInput = {
  "'mélange'": "'mélange'",
  "'priorité occasion'": "'priorité occasion'",
  "'priorité neuf'": "'priorité neuf'",
};

const PurchasingStrategyEnum = {
  "'mélange'": PurchasingStrategy.MIXED,
  "'priorité occasion'": PurchasingStrategy.SECOND_HAND,
  "'priorité neuf'": PurchasingStrategy.NEW,
};

type PurchasingStrategyKey = keyof typeof PurchasingStrategyEnum;

const mapPurchasingStrategy = (
  key: string | undefined,
): PurchasingStrategy | undefined =>
  key ? PurchasingStrategyEnum[key as PurchasingStrategyKey] : undefined;

const AirTravelFrequencyEnum = {
  "'beaucoup'": AirTravelFrequency.ABOVE_3,
  "'moyen'": AirTravelFrequency.FROM_1_TO_3,
  "'faible'": AirTravelFrequency.ZERO,
};

type AirTravelFrequencyKey = keyof typeof AirTravelFrequencyEnum;

const mapAirTravelFrequency = (
  key: string | undefined,
): AirTravelFrequency | undefined =>
  key ? AirTravelFrequencyEnum[key as AirTravelFrequencyKey] : undefined;

export const HeatSourceEnumInput = {
  "'écologique'": "'écologique'",
  "'gaz'": "'gaz'",
  "'fioul'": "'fioul'",
};

const HeatSourceEnum = {
  "'écologique'": HeatSource.ELECTRICITY,
  "'gaz'": HeatSource.GAZ,
  "'fioul'": HeatSource.OIL,
};

type HeatSourceKey = keyof typeof HeatSourceEnum;

const mapHeatSource = (key: string | undefined): HeatSource | undefined =>
  key ? HeatSourceEnum[key as HeatSourceKey] : undefined;

import {
  AirTravelFrequency,
  BroadcastChannel,
  DigitalIntensity,
  HeatSource,
  MeatFrequency,
  PurchasingStrategy,
  TransportationMode,
  type CarbonFootprintAnswer,
} from "@prisma/client";
import { z } from "zod";
import {
  GradationEnumInput,
  HeatSourceEnumInput,
  MeatFrequencyEnumInput,
  PurchasingStrategyEnumInput,
  TransportationModeEnumInput,
} from "../server/carbon-footprint/convert";

export enum CarbonFootprintType {
  CARBON_FOOTPRINT = "carbon_footprint",
}

export const NgcWebhookSchema = z.object({
  calculatedResults: z.object({
    bilan: z.number(),
    transport: z.number(),
    "transport . voiture": z.number(),
    "transport . voiture . km2": z.number(),
    "transport . voiture . thermique . consommation aux 100": z.number(),
    "transport . voiture . thermique . carburant": z.any().optional(), // peut-être une string ou un number
    "transport . voiture . électrique . consommation aux 100": z.number(),
    "transport . avion": z.number(),
    "transport . deux roues": z.number(),
    "transport . mobilité douce": z.number(),
    "transport . train": z.number(),
    "transport . transports commun": z.number(),
    "transport . car longue distance": z.number(),
    "transport . vacances": z.number(),
    "transport . vacances . caravane": z.number(),
    "transport . vacances . camping car": z.number(),
    "transport . vacances . van": z.number(),
    "transport . vacances . location véhicule ": z.number(),
    "transport . vacances . croisière": z.number(),
    "transport . ferry": z.number(),
    alimentation: z.number(),
    "alimentation . repas": z.number(),
    "alimentation . déjeuner et dîner": z.number(),
    "alimentation . bonus": z.number(),
    "alimentation . local . empreinte": z.number(),
    "alimentation . local . consommation": z.string(),
    "alimentation . de saison . empreinte": z.number(),
    "alimentation . petit déjeuner annuel": z.number(),
    "alimentation . déforestation": z.number(),
    "alimentation . boisson": z.number(),
    "alimentation . boisson . chaude": z.number(),
    "alimentation . boisson . froide": z.number(),
    "alimentation . déchets": z.number(),
    "alimentation . déchets . gestes": z.number(),
    logement: z.number(),
    "logement . construction": z.number(),
    "logement . construction . base": z.number(),
    "logement . construction . rafraichissement": z.number(),
    "logement . construction . rénovation": z.number(),
    "logement . construction . déforestation": z.number(),
    "logement . construction . artificialisation sols": z.number(),
    "logement . électricité": z.number(),
    "logement . électricité . consommation totale": z.number(),
    "logement . électricité . photovoltaique . autoconsommation": z.number(),
    "logement . électricité . intensité carbone équivalente": z.number(),
    "logement . chauffage": z.number(),
    "logement . climatisation": z.number(),
    "logement . piscine": z.number(),
    "logement . extérieur": z.number(),
    "logement . vacances": z.number(),
    "logement . vacances . empreinte hotel": z.number(),
    "logement . vacances . empreinte camping": z.number(),
    "logement . vacances . empreinte auberge de jeunesse": z.number(),
    "logement . vacances . empreinte locations": z.number(),
    "logement . vacances . empreinte échange": z.number(),
    "logement . vacances . empreinte résidence secondaire": z.number(),
    divers: z.number(),
    "divers . électroménager": z.number(),
    "divers . électroménager . appareils": z.number(),
    "divers . ameublement": z.number(),
    "divers . ameublement . meubles": z.number(),
    "divers . ameublement . déforestation": z.number(),
    "divers . ameublement . préservation": z.string(),
    "divers . numérique": z.number(),
    "divers . numérique . internet": z.number(),
    "divers . numérique . appareils": z.number(),
    "divers . textile": z.number(),
    "services sociétaux": z.number(),
    "services publics": z.number(),
    "services marchands": z.number(),
  }),
  broadcastChannel: z.nativeEnum(BroadcastChannel),
  neighborhoodId: z.string(),
  answers: z.object({
    userAnswers: z
      .object({
        "services sociétaux . connaissance su": z.string().optional(),
        "services sociétaux . su . choix": z.string().optional(),

        // Su questions
        "services sociétaux . su . calcul su . question 1": z
          .nativeEnum(MeatFrequencyEnumInput)
          .optional(),
        "services sociétaux . su . calcul su . question 2": z
          .nativeEnum(TransportationModeEnumInput)
          .optional(),
        "services sociétaux . su . calcul su . question 4": z
          .nativeEnum(PurchasingStrategyEnumInput)
          .optional(),
        "services sociétaux . su . calcul su . question 5": z
          .nativeEnum(GradationEnumInput)
          .optional(),
        "services sociétaux . su . calcul su . question 6": z
          .nativeEnum(HeatSourceEnumInput)
          .optional(),
        "services sociétaux . su . calcul su . question 3": z
          .nativeEnum(GradationEnumInput)
          .optional(),
      })
      .catchall(z.any()),
    voitures: z.array(z.object({}).passthrough()),
  }),
});

export type NgcWebhookPayload = z.infer<typeof NgcWebhookSchema>;

export const convertedCarbonFootprintAnswer = z.object({
  globalNote: z.number(),
  transportation: z.number(),
  transportationCar: z.number(),
  transportationCarKm2: z.number(),
  transportationCarOilConsumption100: z.number(),
  transportationCarOilType: z.string(),
  transportationCarElectricConsumption100: z.number(),
  transportationPlane: z.number(),
  transportationBicycle: z.number(),
  transportationSoftMobility: z.number(),
  transportationTrain: z.number(),
  transportationPublicTransport: z.number(),
  transportationCarLongDistance: z.number(),
  transportationHollidays: z.number(),
  transportationHollidaysCaravan: z.number(),
  transportationHollidaysCampingCar: z.number(),
  transportationHollidaysVan: z.number(),
  transportationHollidaysRentalVehicle: z.number(),
  transportationHollidaysCruise: z.number(),
  transportationFerry: z.number(),
  alimentation: z.number(),
  alimentationMeals: z.number(),
  alimentationLunchDinner: z.number(),
  alimentationBonus: z.number(),
  alimentationLocalImpact: z.number(),
  alimentationLocalConsumption: z.string(),
  alimentationSeasonalImpact: z.number(),
  alimentationAnnualBreakfast: z.number(),
  alimentationDeforestation: z.number(),
  alimentationDrinks: z.number(),
  alimentationHotDrinks: z.number(),
  alimentationColdDrinks: z.number(),
  alimentationWaste: z.number(),
  alimentationWasteHabits: z.number(),
  logement: z.number(),
  logementConstruction: z.number(),
  logementConstructionBase: z.number(),
  logementConstructionCooling: z.number(),
  logementConstructionRenovation: z.number(),
  logementConstructionDeforestation: z.number(),
  logementConstructionSoilArtificialization: z.number(),
  logementElectricity: z.number(),
  logementElectricityTotalConsumption: z.number(),
  logementElectricitySolarAutoconsumption: z.number(),
  logementElectricityCarbonIntensity: z.number(),
  logementHeating: z.number(),
  logementAirConditioning: z.number(),
  logementSwimmingPool: z.number(),
  logementOutdor: z.number(),
  logementHollidays: z.number(),
  logementHollidaysHotelImpact: z.number(),
  logementHollidaysCampingImpact: z.number(),
  logementHollidaysYouthHostelImpact: z.number(),
  logementHollidaysRentalImpact: z.number(),
  logementHollidaysHomeExchangeImpact: z.number(),
  logementHollidaysSecondaryHomeImpact: z.number(),
  divers: z.number(),
  diversHouseholdAppliances: z.number(),
  diversHouseholdAppliancesDevices: z.number(),
  diversFurniture: z.number(),
  diversFurnitureItems: z.number(),
  diversFurnitureDeforestation: z.number(),
  diversFurniturePreservation: z.string(),
  diversDigital: z.number(),
  diversDigitalInternet: z.number(),
  diversDigitalDevices: z.number(),
  diversTextile: z.number(),
  servicesSocietal: z.number(),
  servicesPublics: z.number(),
  servicesMarket: z.number(),

  broadcastChannel: z.nativeEnum(BroadcastChannel),
  neighborhood: z.string(),
  knowSu: z.boolean(),
  su: z.number().optional(),
  meatFrequency: z.nativeEnum(MeatFrequency).optional(),
  transportationMode: z.nativeEnum(TransportationMode).optional(),
  purchasingStrategy: z.nativeEnum(PurchasingStrategy).optional(),
  airTravelFrequency: z.nativeEnum(AirTravelFrequency).optional(),
  heatSource: z.nativeEnum(HeatSource).optional(),
  digitalIntensity: z.nativeEnum(DigitalIntensity).optional(),

  answers: z.record(z.any()),
});

export type ConvertedCarbonFootprintAnswer = z.infer<
  typeof convertedCarbonFootprintAnswer
>;

export type BuilderCarbonFootprintAnswer = Omit<
  CarbonFootprintAnswer,
  "id" | "createdAt" | "updatedAt" | "su" | "suId"
> &
  Partial<
    Pick<CarbonFootprintAnswer, "id" | "createdAt" | "updatedAt" | "suId">
  >;

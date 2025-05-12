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
    answers: body.answers,
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
    transportationCarOilType:
      body.calculatedResults["transport . voiture . thermique . carburant"] ??
      "",
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

    broadcastChannel: body.answers.broadcastChannel,
    knowSu: body.answers.knowSu,
    su: body.answers.su, // near-47 to confirm we can get it from body
    neighborhood: body.answers.neighborhood,
    airTravelFrequency: body.answers.airTravelFrequency,
    digitalIntensity: body.answers.digitalIntensity,
    heatSource: body.answers.heatSource,
    meatFrequency: body.answers.meatFrequency,
    purchasingStrategy: body.answers.purchasingStrategy,
    transportationMode: body.answers.transportationMode,
  };
};

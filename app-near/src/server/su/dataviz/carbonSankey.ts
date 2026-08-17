import { type CarbonFootprintAnswer } from "@prisma/client";
import { db } from "~/server/db";

export type CarbonField = Extract<
  keyof CarbonFootprintAnswer,
  | "transportationCar"
  | "transportationPlane"
  | "transportationBicycle"
  | "transportationSoftMobility"
  | "transportationTrain"
  | "transportationPublicTransport"
  | "transportationHollidays"
  | "transportationFerry"
  | "alimentationLunchDinner"
  | "alimentationAnnualBreakfast"
  | "alimentationDeforestation"
  | "alimentationDrinks"
  | "alimentationWaste"
  | "logementConstruction"
  | "logementElectricity"
  | "logementHeating"
  | "logementAirConditioning"
  | "logementSwimmingPool"
  | "logementOutdor"
  | "logementHollidays"
  | "diversHouseholdAppliances"
  | "diversFurniture"
  | "diversDigitalInternet"
  | "diversDigitalDevices"
  | "diversTextile"
  | "servicesPublics"
  | "servicesMarket"
>;

type CarbonNode = {
  id: string;
  name: string;
  emoji: string;
  field?: CarbonField;
  children?: CarbonNode[];
};

// Static equivalent of the source project's MetaCarbon.json node hierarchy
// (is_node: true entries only — detail/helper fields are not individually shown).
const CARBON_TREE: CarbonNode[] = [
  {
    id: "transportation",
    name: "Transport",
    emoji: "🚗",
    children: [
      {
        id: "transportationCar",
        name: "Voiture",
        emoji: "🚗",
        field: "transportationCar",
      },
      {
        id: "transportationPlane",
        name: "Avion",
        emoji: "✈️",
        field: "transportationPlane",
      },
      {
        id: "transportationBicycle",
        name: "2 roues",
        emoji: "🛵",
        field: "transportationBicycle",
      },
      {
        id: "transportationSoftMobility",
        name: "Marche, vélo, ...",
        emoji: "🚶‍♂️🚲🛴",
        field: "transportationSoftMobility",
      },
      {
        id: "transportationTrain",
        name: "Train",
        emoji: "🚅",
        field: "transportationTrain",
      },
      {
        id: "transportationPublicTransport",
        name: "Transp. en commun",
        emoji: "🚏🚋",
        field: "transportationPublicTransport",
      },
      {
        id: "transportationHollidays",
        name: "Vacances",
        emoji: "🏖️🚗",
        field: "transportationHollidays",
      },
      {
        id: "transportationFerry",
        name: "Ferry",
        emoji: "⛴️",
        field: "transportationFerry",
      },
    ],
  },
  {
    id: "alimentation",
    name: "Alimentation",
    emoji: "🍽️",
    children: [
      {
        id: "alimentationLunchDinner",
        name: "Plats (dont viande)",
        emoji: "🥩🥦",
        field: "alimentationLunchDinner",
      },
      {
        id: "alimentationAnnualBreakfast",
        name: "Petit dej'",
        emoji: "🥐",
        field: "alimentationAnnualBreakfast",
      },
      {
        id: "alimentationDeforestation",
        name: "Déforestation",
        emoji: "🪵🪓",
        field: "alimentationDeforestation",
      },
      {
        id: "alimentationDrinks",
        name: "Boissons",
        emoji: "🥤🧃",
        field: "alimentationDrinks",
      },
      {
        id: "alimentationWaste",
        name: "Déchets",
        emoji: "🚮",
        field: "alimentationWaste",
      },
    ],
  },
  {
    id: "logement",
    name: "Logement",
    emoji: "🏠",
    children: [
      {
        id: "logementConstruction",
        name: "Construction",
        emoji: "🏗️",
        field: "logementConstruction",
      },
      {
        id: "logementElectricity",
        name: "Electricité",
        emoji: "🔋⚡",
        field: "logementElectricity",
      },
      {
        id: "logementHeating",
        name: "Chauffage",
        emoji: "♨️🏠",
        field: "logementHeating",
      },
      {
        id: "logementAirConditioning",
        name: "Climatisation",
        emoji: "🌀🏠",
        field: "logementAirConditioning",
      },
      {
        id: "logementSwimmingPool",
        name: "Piscine",
        emoji: "🏊",
        field: "logementSwimmingPool",
      },
      {
        id: "logementOutdor",
        name: "Jardin, terrasse",
        emoji: "🌳🏡",
        field: "logementOutdor",
      },
      {
        id: "logementHollidays",
        name: "Vacances",
        emoji: "🏖️🏡",
        field: "logementHollidays",
      },
    ],
  },
  {
    id: "divers",
    name: "Conso de biens",
    emoji: "📦",
    children: [
      {
        id: "diversHouseholdAppliances",
        name: "Électroménager",
        emoji: "🔌🧺",
        field: "diversHouseholdAppliances",
      },
      {
        id: "diversFurniture",
        name: "Meubles",
        emoji: "🪑🛏️🛋️",
        field: "diversFurniture",
      },
      {
        id: "diversDigital",
        name: "Numérique",
        emoji: "👨‍💻",
        children: [
          {
            id: "diversDigitalInternet",
            name: "Internet",
            emoji: "🌐📡",
            field: "diversDigitalInternet",
          },
          {
            id: "diversDigitalDevices",
            name: "Ordis, téléphones, TV, ...",
            emoji: "📱💻🖥️",
            field: "diversDigitalDevices",
          },
        ],
      },
      {
        id: "diversTextile",
        name: "Textile",
        emoji: "👕👗",
        field: "diversTextile",
      },
    ],
  },
  {
    id: "servicesSocietal",
    name: "Services sociétaux",
    emoji: "🏛️",
    children: [
      {
        id: "servicesPublics",
        name: "Services publics",
        emoji: "🏥🏫🚒",
        field: "servicesPublics",
      },
      {
        id: "servicesMarket",
        name: "Services marchands",
        emoji: "🛍️🏬",
        field: "servicesMarket",
      },
    ],
  },
];

const collectFields = (nodes: CarbonNode[]): CarbonField[] =>
  nodes.flatMap((n) =>
    n.children ? collectFields(n.children) : n.field ? [n.field] : [],
  );

export const CARBON_FIELDS = collectFields(CARBON_TREE);

const CARBON_AVG_SELECT = Object.fromEntries(
  [...CARBON_FIELDS, "globalNote"].map((f) => [f, true]),
) as Record<CarbonField | "globalNote", true>;

type CarbonAverages = Partial<
  Record<CarbonField | "globalNote", number | null>
>;

export const computeNodeValue = (
  node: CarbonNode,
  values: Record<CarbonField, number>,
): number =>
  node.children
    ? node.children.reduce((sum, c) => sum + computeNodeValue(c, values), 0)
    : ((node.field ? values[node.field] : undefined) ?? 0);

export type CarbonSankeyNode = {
  id: string;
  name: string;
  emoji: string;
  value: number;
};
export type CarbonSankeyLink = {
  source: number;
  target: number;
  value: number;
};
export type CarbonSankeyData = {
  nodes: CarbonSankeyNode[];
  links: CarbonSankeyLink[];
};

export const buildSankeyData = (
  values: Record<CarbonField, number>,
): CarbonSankeyData => {
  const nodes: CarbonSankeyNode[] = [];
  const links: CarbonSankeyLink[] = [];

  const addNode = (node: CarbonNode): number => {
    const idx = nodes.length;
    nodes.push({
      id: node.id,
      name: node.name,
      emoji: node.emoji,
      value: computeNodeValue(node, values),
    });
    for (const child of node.children ?? []) {
      const childValue = computeNodeValue(child, values);
      if (childValue <= 0) continue;
      const childIdx = addNode(child);
      links.push({ source: idx, target: childIdx, value: childValue });
    }
    return idx;
  };

  for (const root of CARBON_TREE) {
    if (computeNodeValue(root, values) > 0) addNode(root);
  }

  return { nodes, links };
};

const toValues = (avg: CarbonAverages): Record<CarbonField, number> =>
  Object.fromEntries(CARBON_FIELDS.map((f) => [f, avg[f] ?? 0])) as Record<
    CarbonField,
    number
  >;

export type CarbonSankeyResult = {
  sankeyData: CarbonSankeyData;
  totalValue: number;
  isNeighborhood: boolean;
};

export const getCarbonSankey = async (
  surveyId: number,
  selectedSus?: number[],
): Promise<CarbonSankeyResult> => {
  const isNeighborhood = selectedSus?.length !== 1;

  if (!isNeighborhood) {
    const su = await db.suData.findFirst({
      where: { surveyId, su: selectedSus[0] },
      select: { id: true },
    });
    const { _avg } = await db.carbonFootprintAnswer.aggregate({
      where: { surveyId, suId: su?.id },
      _avg: CARBON_AVG_SELECT,
    });
    return {
      isNeighborhood: false,
      sankeyData: buildSankeyData(toValues(_avg)),
      totalValue: _avg.globalNote ?? 0,
    };
  }

  const sus = await db.suData.findMany({
    where: { surveyId },
    select: { id: true, popPercentage: true },
  });

  const suAggregates = await Promise.all(
    sus.map((su) =>
      db.carbonFootprintAnswer.aggregate({
        where: { surveyId, suId: su.id },
        _avg: CARBON_AVG_SELECT,
        _count: true,
      }),
    ),
  );

  const weighted: CarbonAverages = {};
  let weightSum = 0;

  sus.forEach((su, i) => {
    const weight = su.popPercentage / 100;
    if (weight <= 0) return;

    const { _avg, _count } = suAggregates[i]!;
    if (_count === 0) return;

    weightSum += weight;
    for (const field of [...CARBON_FIELDS, "globalNote"] as const) {
      weighted[field] = (weighted[field] ?? 0) + (_avg[field] ?? 0) * weight;
    }
  });

  const normalized: CarbonAverages =
    weightSum > 0
      ? Object.fromEntries(
          Object.entries(weighted).map(([k, v]) => [k, (v ?? 0) / weightSum]),
        )
      : {};

  return {
    isNeighborhood: true,
    sankeyData: buildSankeyData(toValues(normalized)),
    totalValue: normalized.globalNote ?? 0,
  };
};

export const getCarbonSankeyGlobalMax = async (
  surveyId: number,
): Promise<number> => {
  const sus = await db.suData.findMany({
    where: { surveyId },
    select: { id: true },
  });

  const suAggregates = await Promise.all(
    sus.map((su) =>
      db.carbonFootprintAnswer.aggregate({
        where: { surveyId, suId: su.id },
        _avg: CARBON_AVG_SELECT,
      }),
    ),
  );

  let max = 0;
  for (const { _avg } of suAggregates) {
    const values = toValues(_avg);
    for (const root of CARBON_TREE) {
      const value = computeNodeValue(root, values);
      if (value > max) max = value;
    }
  }

  return max || 1;
};

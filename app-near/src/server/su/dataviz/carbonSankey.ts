import { type CarbonFootprintAnswer } from "@prisma/client";
import { db } from "~/server/db";
import { resolveSuId, getWeightedSus } from "~/server/su/dataviz/suSelection";

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

type CarbonBranchId =
  | "transportation"
  | "alimentation"
  | "logement"
  | "divers"
  | "diversDigital"
  | "servicesSocietal";

type CarbonNode =
  | {
      id: CarbonBranchId;
      name: string;
      emoji: string;
      children: CarbonNode[];
    }
  | { id: CarbonField; name: string; emoji: string };

const CARBON_TREE: CarbonNode[] = [
  {
    id: "transportation",
    name: "Transport",
    emoji: "🚗",
    children: [
      { id: "transportationCar", name: "Voiture", emoji: "🚗" },
      { id: "transportationPlane", name: "Avion", emoji: "✈️" },
      { id: "transportationBicycle", name: "2 roues", emoji: "🛵" },
      {
        id: "transportationSoftMobility",
        name: "Marche, vélo, ...",
        emoji: "🚶‍♂️🚲🛴",
      },
      { id: "transportationTrain", name: "Train", emoji: "🚅" },
      {
        id: "transportationPublicTransport",
        name: "Transp. en commun",
        emoji: "🚏🚋",
      },
      { id: "transportationHollidays", name: "Vacances", emoji: "🏖️🚗" },
      { id: "transportationFerry", name: "Ferry", emoji: "⛴️" },
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
      },
      { id: "alimentationAnnualBreakfast", name: "Petit dej'", emoji: "🥐" },
      { id: "alimentationDeforestation", name: "Déforestation", emoji: "🪵🪓" },
      { id: "alimentationDrinks", name: "Boissons", emoji: "🥤🧃" },
      { id: "alimentationWaste", name: "Déchets", emoji: "🚮" },
    ],
  },
  {
    id: "logement",
    name: "Logement",
    emoji: "🏠",
    children: [
      { id: "logementConstruction", name: "Construction", emoji: "🏗️" },
      { id: "logementElectricity", name: "Electricité", emoji: "🔋⚡" },
      { id: "logementHeating", name: "Chauffage", emoji: "♨️🏠" },
      { id: "logementAirConditioning", name: "Climatisation", emoji: "🌀🏠" },
      { id: "logementSwimmingPool", name: "Piscine", emoji: "🏊" },
      { id: "logementOutdor", name: "Jardin, terrasse", emoji: "🌳🏡" },
      { id: "logementHollidays", name: "Vacances", emoji: "🏖️🏡" },
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
      },
      { id: "diversFurniture", name: "Meubles", emoji: "🪑🛏️🛋️" },
      {
        id: "diversDigital",
        name: "Numérique",
        emoji: "👨‍💻",
        children: [
          { id: "diversDigitalInternet", name: "Internet", emoji: "🌐📡" },
          {
            id: "diversDigitalDevices",
            name: "Ordis, téléphones, TV, ...",
            emoji: "📱💻🖥️",
          },
        ],
      },
      { id: "diversTextile", name: "Textile", emoji: "👕👗" },
    ],
  },
  {
    id: "servicesSocietal",
    name: "Services sociétaux",
    emoji: "🏛️",
    children: [
      { id: "servicesPublics", name: "Services publics", emoji: "🏥🏫🚒" },
      { id: "servicesMarket", name: "Services marchands", emoji: "🛍️🏬" },
    ],
  },
];

const collectFields = (nodes: CarbonNode[]): CarbonField[] =>
  nodes.flatMap((n) => ("children" in n ? collectFields(n.children) : [n.id]));

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
  "children" in node
    ? node.children.reduce((sum, c) => sum + computeNodeValue(c, values), 0)
    : (values[node.id] ?? 0);

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
    if ("children" in node) {
      for (const child of node.children) {
        const childValue = computeNodeValue(child, values);
        if (childValue <= 0) continue;
        const childIdx = addNode(child);
        links.push({ source: idx, target: childIdx, value: childValue });
      }
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
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  if (!isNeighborhood) {
    const { _avg } = await db.carbonFootprintAnswer.aggregate({
      where: { surveyId, suId },
      _avg: CARBON_AVG_SELECT,
    });
    return {
      isNeighborhood: false,
      sankeyData: buildSankeyData(toValues(_avg)),
      totalValue: _avg.globalNote ?? 0,
    };
  }

  const weightedSus = await getWeightedSus(surveyId);

  const suAggregates = await Promise.all(
    weightedSus.map((su) =>
      db.carbonFootprintAnswer.aggregate({
        where: { surveyId, suId: su.id },
        _avg: CARBON_AVG_SELECT,
        _count: true,
      }),
    ),
  );

  const weighted: CarbonAverages = {};
  let weightSum = 0;

  weightedSus.forEach((su, i) => {
    const { _avg, _count } = suAggregates[i]!;
    if (_count === 0) return;

    weightSum += su.weight;
    for (const field of [...CARBON_FIELDS, "globalNote"] as const) {
      weighted[field] = (weighted[field] ?? 0) + (_avg[field] ?? 0) * su.weight;
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

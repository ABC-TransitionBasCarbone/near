import { TransportMode, TransportTime } from "@prisma/client";
import { db } from "~/server/db";
import { type ZoneSelection } from "~/types/enums/zoneSelection";
import {
  buildZoneCellKey,
  ZONE_SELECTIONS,
  type MobilityType,
  type ZoneProximity,
} from "~/shared/services/dataviz/mobility";
import { resolveSuId, getWeightedSus } from "~/server/su/dataviz/suSelection";

export type { MobilityType };

const BASE_WEIGHT_WORK = 5;
const BASE_WEIGHT_HOBBY = 1.2;
const BASE_WEIGHT_FOOD = 1;

type TripCategory = ZoneProximity | "NSP";

export type MobilityTypeBreakdown = {
  pct: { FOOT: number; BIKE: number; TRANS: number; CAR: number };
};

export type ZoneCellBreakdown = {
  respondentCount: number;
  pct: { work: number; hobby: number; buyFood: number };
  pctOfTotal: number;
  mobilityTypeBreakdown: MobilityTypeBreakdown;
};

export type ZoneDistribution = Record<string, ZoneCellBreakdown>;
export type MobilityResult = { zoneDistribution: ZoneDistribution };

export const classifyTrip = (
  mode: TransportMode | null | undefined,
  time: TransportTime | null | undefined,
): TripCategory => {
  if (!mode || !time) return "NSP";
  if (mode === TransportMode.NONE_I_DONT_MOVE) return "NSP";
  if (time === TransportTime.LESS_THAN_10_MIN) return "A";
  const slowModes = new Set<TransportMode>([
    TransportMode.WALKING,
    TransportMode.PERSONAL_BICYCLE,
    TransportMode.SHARED_BICYCLE,
  ]);
  if (time === TransportTime.BETWEEN_10_AND_20_MIN && slowModes.has(mode))
    return "A";
  return "B";
};

export const classifyMobilityType = (
  mode: TransportMode | null | undefined,
): MobilityType | null => {
  if (!mode) return null;
  if (mode === TransportMode.WALKING) return "FOOT";
  if (
    mode === TransportMode.PERSONAL_BICYCLE ||
    mode === TransportMode.SHARED_BICYCLE
  )
    return "BIKE";
  if (mode === TransportMode.PUBLIC_TRANSPORT) return "TRANS";
  if (
    mode === TransportMode.CAR ||
    mode === TransportMode.ELECTRIC_CAR ||
    mode === TransportMode.TAXI_VTC
  )
    return "CAR";
  return null;
};

const KNOWN_ZONES = new Set<string>(ZONE_SELECTIONS);

const getCellKey = (zone: string, category: TripCategory): string | null => {
  if (category === "NSP") return null;
  if (!KNOWN_ZONES.has(zone)) return null;
  return buildZoneCellKey(zone as ZoneSelection, category);
};

type MobilityAnswer = {
  workZone: string | null;
  transportModeToWork: TransportMode;
  transportTimeToWork: TransportTime | null;
  remoteWorkingWeeklyFrequency: number | null;
  hobbyZone: string | null;
  transportModeToHobby: TransportMode;
  transportTimeToHobby: TransportTime | null;
  foodMarketZone: string | null;
  transportModeToBuyFood: TransportMode;
  transportTimeToBuyFood: TransportTime | null;
};

type MobilityEntry = {
  effectiveWorkWeight: number;
  workZone: string | null;
  transportModeToWork: TransportMode;
  categoryWork: TripCategory;
  hobbyZone: string | null;
  transportModeToHobby: TransportMode;
  categoryHobby: TripCategory;
  foodMarketZone: string | null;
  transportModeToBuyFood: TransportMode;
  categoryBuyFood: TripCategory;
};

const toEntries = (answers: MobilityAnswer[]): MobilityEntry[] => {
  const remoteFreqs = answers
    .map((a) => a.remoteWorkingWeeklyFrequency)
    .filter((v): v is number => v != null);
  const meanRemoteWorkFrequency =
    remoteFreqs.length > 0
      ? remoteFreqs.reduce((sum, v) => sum + v, 0) / remoteFreqs.length
      : 0;

  return answers.map((a) => {
    const remoteFreq =
      a.remoteWorkingWeeklyFrequency ?? meanRemoteWorkFrequency;
    return {
      effectiveWorkWeight: Math.max(0, BASE_WEIGHT_WORK - remoteFreq),
      workZone: a.workZone,
      transportModeToWork: a.transportModeToWork,
      categoryWork: classifyTrip(a.transportModeToWork, a.transportTimeToWork),
      hobbyZone: a.hobbyZone,
      transportModeToHobby: a.transportModeToHobby,
      categoryHobby: classifyTrip(
        a.transportModeToHobby,
        a.transportTimeToHobby,
      ),
      foodMarketZone: a.foodMarketZone,
      transportModeToBuyFood: a.transportModeToBuyFood,
      categoryBuyFood: classifyTrip(
        a.transportModeToBuyFood,
        a.transportTimeToBuyFood,
      ),
    };
  });
};

const buildZoneDistribution = (entries: MobilityEntry[]): ZoneDistribution => {
  const acc: Record<string, { work: number; hobby: number; buyFood: number }> =
    {};
  const respondentSets: Record<string, Set<number>> = {};
  const mobilityAcc: Record<
    string,
    { FOOT: number; BIKE: number; TRANS: number; CAR: number }
  > = {};

  const maxPossible =
    entries.length * (BASE_WEIGHT_HOBBY + BASE_WEIGHT_FOOD) +
    entries.reduce((sum, e) => sum + e.effectiveWorkWeight, 0);

  const add = (
    idx: number,
    zone: string | null,
    category: TripCategory,
    purpose: "work" | "hobby" | "buyFood",
    mode: TransportMode | null,
    w: number,
  ) => {
    if (!zone) return;
    const key = getCellKey(zone, category);
    if (!key) return;
    acc[key] ??= { work: 0, hobby: 0, buyFood: 0 };
    acc[key][purpose] += w;
    respondentSets[key] ??= new Set();
    respondentSets[key].add(idx);
    const mt = classifyMobilityType(mode);
    if (mt) {
      mobilityAcc[key] ??= { FOOT: 0, BIKE: 0, TRANS: 0, CAR: 0 };
      mobilityAcc[key][mt] += w;
    }
  };

  entries.forEach((e, i) => {
    add(
      i,
      e.workZone,
      e.categoryWork,
      "work",
      e.transportModeToWork,
      e.effectiveWorkWeight,
    );
    add(
      i,
      e.hobbyZone,
      e.categoryHobby,
      "hobby",
      e.transportModeToHobby,
      BASE_WEIGHT_HOBBY,
    );
    add(
      i,
      e.foodMarketZone,
      e.categoryBuyFood,
      "buyFood",
      e.transportModeToBuyFood,
      BASE_WEIGHT_FOOD,
    );
  });

  const result: ZoneDistribution = {};
  for (const [key, counts] of Object.entries(acc)) {
    const total = counts.work + counts.hobby + counts.buyFood;
    const pct = (n: number) =>
      total > 0 ? Math.round((n / total) * 10000) / 100 : 0;
    const pctOfTotal =
      maxPossible > 0 ? Math.round((total / maxPossible) * 10000) / 100 : 0;

    const mt = mobilityAcc[key] ?? { FOOT: 0, BIKE: 0, TRANS: 0, CAR: 0 };
    const mtTotal = mt.FOOT + mt.BIKE + mt.TRANS + mt.CAR;
    const mtPct = (n: number) =>
      mtTotal > 0 ? Math.round((n / mtTotal) * 10000) / 100 : 0;

    result[key] = {
      respondentCount: respondentSets[key]?.size ?? 0,
      pct: {
        work: pct(counts.work),
        hobby: pct(counts.hobby),
        buyFood: pct(counts.buyFood),
      },
      pctOfTotal,
      mobilityTypeBreakdown: {
        pct: {
          FOOT: mtPct(mt.FOOT),
          BIKE: mtPct(mt.BIKE),
          TRANS: mtPct(mt.TRANS),
          CAR: mtPct(mt.CAR),
        },
      },
    };
  }
  return result;
};

const MOBILITY_SELECT = {
  workZone: true,
  transportModeToWork: true,
  transportTimeToWork: true,
  remoteWorkingWeeklyFrequency: true,
  hobbyZone: true,
  transportModeToHobby: true,
  transportTimeToHobby: true,
  foodMarketZone: true,
  transportModeToBuyFood: true,
  transportTimeToBuyFood: true,
} as const;

export const getMobility = async (
  surveyId: number,
  selectedSus?: number[],
): Promise<MobilityResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  if (!isNeighborhood) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId },
      select: MOBILITY_SELECT,
    });
    return { zoneDistribution: buildZoneDistribution(toEntries(answers)) };
  }

  const weightedSus = await getWeightedSus(surveyId);

  const perSu: { zoneDistribution: ZoneDistribution; weight: number }[] = [];
  for (const su of weightedSus) {
    const answers = await db.wayOfLifeAnswer.findMany({
      where: { surveyId, suId: su.id },
      select: MOBILITY_SELECT,
    });
    if (answers.length === 0) continue;
    perSu.push({
      zoneDistribution: buildZoneDistribution(toEntries(answers)),
      weight: su.weight,
    });
  }

  const allZoneKeys = new Set<string>();
  for (const { zoneDistribution } of perSu) {
    for (const k of Object.keys(zoneDistribution)) allZoneKeys.add(k);
  }

  const result: ZoneDistribution = {};
  for (const zk of allZoneKeys) {
    const cells = perSu.filter(
      ({ zoneDistribution }) => zk in zoneDistribution,
    );
    const weightSum = cells.reduce((s, c) => s + c.weight, 0);
    if (weightSum <= 0) continue;
    const wmean = (get: (c: ZoneCellBreakdown) => number) =>
      cells.reduce(
        (sum, { zoneDistribution, weight }) =>
          sum + get(zoneDistribution[zk]!) * weight,
        0,
      ) / weightSum;

    result[zk] = {
      respondentCount: cells.reduce(
        (s, c) => s + c.zoneDistribution[zk]!.respondentCount,
        0,
      ),
      pct: {
        work: Math.round(wmean((c) => c.pct.work) * 100) / 100,
        hobby: Math.round(wmean((c) => c.pct.hobby) * 100) / 100,
        buyFood: Math.round(wmean((c) => c.pct.buyFood) * 100) / 100,
      },
      pctOfTotal: Math.round(wmean((c) => c.pctOfTotal) * 100) / 100,
      mobilityTypeBreakdown: {
        pct: {
          FOOT:
            Math.round(wmean((c) => c.mobilityTypeBreakdown.pct.FOOT) * 100) /
            100,
          BIKE:
            Math.round(wmean((c) => c.mobilityTypeBreakdown.pct.BIKE) * 100) /
            100,
          TRANS:
            Math.round(wmean((c) => c.mobilityTypeBreakdown.pct.TRANS) * 100) /
            100,
          CAR:
            Math.round(wmean((c) => c.mobilityTypeBreakdown.pct.CAR) * 100) /
            100,
        },
      },
    };
  }

  return { zoneDistribution: result };
};

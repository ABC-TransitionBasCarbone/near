import { ZoneSelection } from "~/types/enums/zoneSelection";

export type MobilityType = "FOOT" | "BIKE" | "TRANS" | "CAR";

export const MOBILITY_TYPES: MobilityType[] = ["FOOT", "BIKE", "TRANS", "CAR"];

export type ZoneProximity = "A" | "B";

export const ZONE_SELECTIONS: ZoneSelection[] = Object.values(ZoneSelection);

export const buildZoneCellKey = (
  zone: ZoneSelection,
  proximity: ZoneProximity,
): string =>
  zone === ZoneSelection.ZONE_QUARTIER ? zone : `${zone}_${proximity}`;

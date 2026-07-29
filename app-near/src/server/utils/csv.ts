import Papa from "papaparse";

export const buildCsv = <T, R extends Record<string, unknown>>(
  rows: T[],
  mapRow: (row: T) => R,
): string => Papa.unparse(rows.map(mapRow));

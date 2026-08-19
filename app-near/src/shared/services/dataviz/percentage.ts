export const toPercentage = (count: number, total: number): number =>
  total > 0 ? Math.round((count / total) * 1000) / 10 : 0;

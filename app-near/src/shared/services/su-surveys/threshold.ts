export const THRESHOLD_ALERT_VALUE = -1.5;
export const THRESHOLD_ACCEPT_VALUE = 2;

export const getBelowThresholdValues = <T extends string>(
  criteria: Record<T, number>,
  threshold: number,
): Record<T, number> => {
  return Object.fromEntries(
    (Object.entries(criteria) as [T, number][]).filter(
      ([_, value]) => value < threshold,
    ),
  ) as Record<T, number>;
};

export const isRepresentativenessValid = <T extends string>(
  criteria: Record<T, number>,
  threshold: number,
): boolean =>
  (Object.entries(criteria) as [T, number][]).every(
    ([_, value]) => Math.abs(value) < threshold,
  );

export const THRESHOLD_VALUE = -3.5;

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

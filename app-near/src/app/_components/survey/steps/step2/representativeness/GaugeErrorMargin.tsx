import Gauge, { type GaugeZone } from "~/app/_components/_ui/Gauge";

interface GaugeErrorMarginProps {
  value?: number;
  percentiles: (number | undefined)[];
}

const ZONE_COLORS = ["#FEFEE3", "#FFC9B9", "#DDDF03", "#ABCC02", "#55A630"];
const LEGEND_LABELS = [">5 %", "<5 %", "<4,5 %", "<4 %", "<3 %"];

const MAX_ZONE_RATIO = 1.1;

const roundToUpperN = (value: number, n: number): number =>
  Math.ceil(value / n) * n;

const buildZones = (thresholds: number[]): GaugeZone[] => {
  const roundedThresholds = thresholds.map((t) => roundToUpperN(t, 1));
  const lastThreshold = roundedThresholds[roundedThresholds.length - 1] ?? 0;

  return [
    ...roundedThresholds.map((to, i) => ({
      to,
      color: ZONE_COLORS[i]!,
      label: to.toLocaleString("fr-FR"),
      legendLabel: LEGEND_LABELS[i],
    })),
    {
      to: lastThreshold * MAX_ZONE_RATIO,
      color: ZONE_COLORS[ZONE_COLORS.length - 1]!,
      legendLabel: LEGEND_LABELS[LEGEND_LABELS.length - 1],
    },
  ];
};

const GaugeErrorMargin: React.FC<GaugeErrorMarginProps> = ({
  value,
  percentiles,
}) => {
  const thresholds = percentiles.every((p): p is number => p !== undefined)
    ? percentiles
    : undefined;

  return (
    <Gauge
      value={value}
      zones={thresholds ? buildZones(thresholds) : []}
      startAngle={-120}
      endAngle={120}
      unitLabel={`répondant${value ? "s" : ""}`}
    />
  );
};

export default GaugeErrorMargin;

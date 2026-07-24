import * as d3 from "d3";
import Gauge, { type GaugeZone } from "~/app/_components/_ui/Gauge";

interface GaugeErrorMarginProps {
  value?: number;
  percentiles: (number | undefined)[];
}

const GOOD_COLOR = "#0ca30c";
const ZONE_COLORS = ["#d03b3b", "#ec835a", "#fab219", GOOD_COLOR];
const LEGEND_LABELS = [">5 %", "<5 %", "<4,5 %", "<4 %", "<3 %"];

const EXCELLENT_COLOR =
  d3.color(GOOD_COLOR)?.darker(0.7).formatHex() ?? GOOD_COLOR;
const MAX_ZONE_RATIO = 1.1;

const roundToUpper50 = (value: number): number => Math.ceil(value / 50) * 50;

const buildZones = (thresholds: number[]): GaugeZone[] => {
  const lastThreshold = thresholds[thresholds.length - 1] ?? 0;

  return [
    ...thresholds.map((to, i) => ({
      to,
      color: ZONE_COLORS[i]!,
      label: roundToUpper50(to).toLocaleString("fr-FR"),
      legendLabel: LEGEND_LABELS[i],
    })),
    {
      to: lastThreshold * MAX_ZONE_RATIO,
      color: EXCELLENT_COLOR,
      legendLabel: LEGEND_LABELS[4],
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
      startAngle={-180}
      endAngle={90}
      unitLabel="répondants"
    />
  );
};

export default GaugeErrorMargin;

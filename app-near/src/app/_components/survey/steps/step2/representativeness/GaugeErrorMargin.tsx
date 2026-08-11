import Gauge, { type GaugeZone } from "~/app/_components/_ui/Gauge";

interface GaugeErrorMarginProps {
  value?: number;
  percentiles: (number | undefined)[];
}

interface ZoneConfig {
  color: string;
  legendLabel: string;
}

const ZONE_CONFIG: ZoneConfig[] = [
  { color: "#FEFEE3", legendLabel: ">5 %" },
  { color: "#FFC9B9", legendLabel: "<5 %" },
  { color: "#DDDF03", legendLabel: "<4,5 %" },
  { color: "#ABCC02", legendLabel: "<4 %" },
  { color: "#55A630", legendLabel: "<3 %" },
];

const MAX_ZONE_RATIO = 1.1;

const roundToUpperN = (value: number, n: number): number =>
  Math.ceil(value / n) * n;

const buildZones = (thresholds: number[]): GaugeZone[] => {
  const roundedThresholds = thresholds.map((t) => roundToUpperN(t, 1));
  const lastThreshold = roundedThresholds[roundedThresholds.length - 1] ?? 0;
  const lastZoneConfig = ZONE_CONFIG[ZONE_CONFIG.length - 1]!;

  return [
    ...roundedThresholds.map((to, i) => ({
      to,
      color: ZONE_CONFIG[i]!.color,
      label: to.toLocaleString("fr-FR"),
      legendLabel: ZONE_CONFIG[i]!.legendLabel,
    })),
    {
      to: lastThreshold * MAX_ZONE_RATIO,
      color: lastZoneConfig.color,
      legendLabel: lastZoneConfig.legendLabel,
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
      legendTitle="Marge d'erreur estimée"
    />
  );
};

export default GaugeErrorMargin;

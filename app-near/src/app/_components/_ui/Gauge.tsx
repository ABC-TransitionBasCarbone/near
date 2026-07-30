"use client";
// inspiration :
// - https://observablehq.com/@d3/gallery
// - https://d3-graph-gallery.com/

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { colors } from "tailwind.config";

export interface GaugeZone {
  to: number;
  color: string;
  label?: string;
  legendLabel?: string;
}

interface GaugeProps {
  value?: number;
  zones: GaugeZone[];
  min?: number;
  startAngle?: number;
  endAngle?: number;
  radius?: number;
  trackWidth?: number;
  needleColor?: string;
  tickLabelColor?: string;
  valueColor?: string;
  unitLabel?: string;
  valueFormatter?: (value: number) => string;
}

const PADDING = 16;
const LABEL_OFFSET = 14;
const VALUE_BLOCK_HEIGHT = 50;

// Do not simplify, it allows to have startAngle > endAngle
// when you want to invert gauge rotation.
const getArcBounds = (startAngle: number, endAngle: number, radius: number) => {
  const angles = [startAngle, endAngle, -180, -90, 0, 90, 180].filter(
    (angle) =>
      angle === startAngle ||
      angle === endAngle ||
      (angle > startAngle && angle < endAngle),
  );

  let minX = 0;
  let maxX = 0;
  let minY = 0;
  let maxY = 0;
  angles.forEach((deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    const x = Math.cos(rad) * radius;
    const y = Math.sin(rad) * radius;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  });

  return { minX, maxX, minY, maxY };
};

const ARROW_HEIGHT = 16;
const ARROW_HALF_BASE = 9;

const buildArrowPath = (innerRadius: number): string => {
  const baseY = -innerRadius;
  const tipY = baseY - ARROW_HEIGHT;
  return `M 0,${tipY} L ${-ARROW_HALF_BASE},${baseY} L ${ARROW_HALF_BASE},${baseY} Z`;
};

const Gauge: React.FC<GaugeProps> = ({
  value,
  zones,
  min = 0,
  startAngle = -90,
  endAngle = 90,
  radius = 96,
  trackWidth = 30,
  needleColor = colors.black,
  tickLabelColor = colors.gray,
  valueColor = colors.black,
  unitLabel,
  valueFormatter = (v) => v.toLocaleString("fr-FR"),
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const maxValue = zones[zones.length - 1]?.to ?? min;
  const labelRadius = radius + LABEL_OFFSET;

  const bounds = getArcBounds(startAngle, endAngle, labelRadius);
  const width = bounds.maxX - bounds.minX + PADDING * 2;
  const height =
    Math.max(bounds.maxY, VALUE_BLOCK_HEIGHT) - bounds.minY + PADDING * 2;
  const centerX = PADDING - bounds.minX;
  const centerY = PADDING - bounds.minY;

  useEffect(() => {
    if (!svgRef.current || zones.length === 0 || value === undefined) {
      return;
    }

    const angleScale = d3
      .scaleLinear()
      .domain([min, maxValue])
      .range([startAngle, endAngle])
      .clamp(true);

    const zoneBounds = [min, ...zones.map((zone) => zone.to)];

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    const arcGenerator = d3
      .arc<{ start: number; end: number }>()
      .innerRadius(radius - trackWidth)
      .outerRadius(radius)
      .startAngle((d) => (angleScale(d.start) * Math.PI) / 180)
      .endAngle((d) => (angleScale(d.end) * Math.PI) / 180);

    zones.forEach((zone, i) => {
      root
        .append("path")
        .attr(
          "d",
          arcGenerator({ start: zoneBounds[i]!, end: zoneBounds[i + 1]! }),
        )
        .attr("fill", zone.color);
    });

    zones.forEach((zone) => {
      if (!zone.label) {
        return;
      }
      const standardAngle = ((angleScale(zone.to) - 90) * Math.PI) / 180;
      root
        .append("text")
        .attr("x", Math.cos(standardAngle) * labelRadius)
        .attr("y", Math.sin(standardAngle) * labelRadius)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 10)
        .attr("fill", tickLabelColor)
        .text(zone.label);
    });

    root
      .append("path")
      .attr("d", buildArrowPath(radius - trackWidth))
      .attr("fill", needleColor)
      .attr("stroke", colors.white)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("transform", `rotate(${startAngle})`)
      .transition()
      .duration(600)
      .attr("transform", `rotate(${angleScale(value)})`);

    svg
      .append("text")
      .attr("x", centerX)
      .attr("y", centerY)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 22)
      .attr("font-weight", 700)
      .attr("fill", valueColor)
      .text(valueFormatter(value));

    if (unitLabel) {
      svg
        .append("text")
        .attr("x", centerX)
        .attr("y", centerY + 18)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 11)
        .attr("fill", tickLabelColor)
        .text(unitLabel);
    }
  }, [
    value,
    zones,
    min,
    maxValue,
    startAngle,
    endAngle,
    radius,
    trackWidth,
    needleColor,
    tickLabelColor,
    valueColor,
    unitLabel,
    valueFormatter,
    centerX,
    centerY,
    labelRadius,
  ]);

  const legendZones = zones.filter((zone) => zone.legendLabel);

  if (zones.length === 0 || value === undefined) {
    return (
      <div
        style={{ maxWidth: width, aspectRatio: `${width} / ${height}` }}
        className="w-full animate-pulse rounded bg-grayExtraLight"
      />
    );
  }

  const currentZone = zones.find((zone) => value <= zone.to) ?? zones.at(-1);
  const currentZoneLabel = currentZone?.legendLabel ?? currentZone?.label;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        style={{ maxWidth: width }}
        className="h-auto w-full"
        aria-hidden="true"
      />
      <p className="sr-only">
        {valueFormatter(value)}
        {unitLabel ? ` ${unitLabel}` : ""}
        {currentZoneLabel ? ` (zone : ${currentZoneLabel})` : ""}
      </p>
      {legendZones.length > 0 && (
        <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {legendZones.map((zone) => (
            <li
              key={zone.legendLabel}
              className="flex items-center gap-1.5 text-xs"
              style={{ color: tickLabelColor }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: zone.color }}
              />
              {zone.legendLabel}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Gauge;

"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { useMouseTooltip } from "./hooks/useMouseTooltip";

export interface PieSlice {
  key: string;
  label: string;
  value: number;
  color: string;
  emoji?: string;
  tooltip?: string;
}

interface PieChartProps {
  slices: PieSlice[];
  radius?: number;
  innerRadiusRatio?: number;
  centerContent?: string;
  centerFontSize?: number;
  minLabelPercentage?: number;
  valueFormatter?: (percentage: number) => string;
  labelTextColor?: string;
  labelHalo?: boolean;
}

const PADDING = 16;

const PieChart: React.FC<PieChartProps> = ({
  slices,
  radius = 96,
  innerRadiusRatio = 0,
  centerContent,
  centerFontSize,
  minLabelPercentage = 5,
  valueFormatter = (pct) => `${pct.toFixed(0)}%`,
  labelTextColor = "#ffffff",
  labelHalo = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, tooltip, showTooltip, hideTooltip } = useMouseTooltip();

  const total = slices.reduce((sum, s) => sum + s.value, 0) || 1;
  const width = radius * 2 + PADDING * 2;
  const height = radius * 2 + PADDING * 2;
  const centerY = PADDING + radius;
  const innerRadius = radius * innerRadiusRatio;

  useEffect(() => {
    if (!svgRef.current || slices.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${centerY})`);

    const pie = d3
      .pie<PieSlice>()
      .value((d) => d.value)
      .sort(null);
    const arc = d3
      .arc<d3.PieArcDatum<PieSlice>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);
    const arcs = pie(slices);

    g.selectAll<SVGPathElement, d3.PieArcDatum<PieSlice>>("path.slice")
      .data(arcs)
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mousemove", function (event: MouseEvent, d) {
        const pct = (d.data.value / total) * 100;
        showTooltip(
          event,
          d.data.tooltip ?? `${d.data.label} : ${pct.toFixed(1)}%`,
        );
        d3.select(this).attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        hideTooltip();
        d3.select(this).attr("stroke-width", 1.5);
      });

    arcs.forEach((d) => {
      const pct = (d.data.value / total) * 100;
      if (pct < minLabelPercentage) return;
      const centroid = arc.centroid(d);
      g.append("text")
        .attr("x", centroid[0])
        .attr("y", centroid[1])
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "central")
        .style("font-size", innerRadius > 0 ? "10px" : "14px")
        .style("font-weight", 700)
        .style("fill", labelTextColor)
        .style("paint-order", labelHalo ? "stroke fill" : "")
        .style("stroke", labelHalo ? "rgba(0,0,0,0.35)" : "")
        .style("stroke-width", labelHalo ? "3px" : "")
        .style("pointer-events", "none")
        .text(
          `${d.data.emoji ? `${d.data.emoji} ` : ""}${valueFormatter(pct)}`,
        );
    });

    if (centerContent && innerRadius > 0) {
      const fo = g
        .append("foreignObject")
        .attr("x", -innerRadius)
        .attr("y", -innerRadius)
        .attr("width", innerRadius * 2)
        .attr("height", innerRadius * 2)
        .style("pointer-events", "none");
      fo.append("xhtml:div")
        .style("width", "100%")
        .style("height", "100%")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("line-height", "1")
        .style("font-size", `${centerFontSize ?? innerRadius * 1.1}px`)
        .text(centerContent);
    }
  }, [
    slices,
    radius,
    innerRadius,
    centerContent,
    centerFontSize,
    minLabelPercentage,
    valueFormatter,
    total,
    width,
    centerY,
    labelTextColor,
    labelHalo,
    showTooltip,
    hideTooltip,
  ]);

  if (slices.length === 0) return null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <svg ref={svgRef} width={width} height={height} aria-hidden="true" />
      <ul className="sr-only">
        {slices
          .filter((s) => s.value > 0)
          .map((s) => (
            <li key={s.key}>
              {s.label} : {((s.value / total) * 100).toFixed(1)}%
            </li>
          ))}
      </ul>
      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white"
          style={{ left: tooltip.x + 10, top: tooltip.y - 10 }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};

export default PieChart;

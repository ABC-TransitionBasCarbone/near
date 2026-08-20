"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { colors } from "tailwind.config";
import { useMouseTooltip } from "./hooks/useMouseTooltip";

export interface StackedBarSegment {
  key: string;
  label: string;
  percentage: number;
  color: string;
  emoji?: string;
  tooltip?: string;
}

export interface StackedBarRow {
  id: string;
  title?: string;
  titleEmoji?: string;
  segments: StackedBarSegment[];
}

interface StackedBarListProps {
  rows: StackedBarRow[];
  title?: string;
  titleColor?: string;
  headerRight?: string;
  barHeight?: number;
  rowGap?: number;
  normalize?: boolean;
  minSegmentWidthForLabel?: number;
  showLegend?: boolean;
  rowTitleColor?: string;
  segmentLabelColor?: string;
}

const PADDING = 16;
const ROW_TITLE_HEIGHT = 18;

const StackedBarList: React.FC<StackedBarListProps> = ({
  rows,
  title,
  titleColor = colors.black,
  headerRight,
  barHeight = 30,
  rowGap = 24,
  normalize = false,
  minSegmentWidthForLabel = 32,
  showLegend = false,
  rowTitleColor = colors.black,
  segmentLabelColor = colors.white,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef, tooltip, showTooltip, hideTooltip } = useMouseTooltip();
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setContainerWidth(entry.contentRect.width);
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [containerRef]);

  const rowBlockHeight = (row: StackedBarRow) =>
    (row.title ? ROW_TITLE_HEIGHT : 0) + barHeight;
  const chartHeight =
    rows.reduce((sum, row) => sum + rowBlockHeight(row), 0) +
    Math.max(0, rows.length - 1) * rowGap;
  const barWidth = Math.max(0, containerWidth - PADDING * 2);
  const height = chartHeight + PADDING * 2;

  const legendItems = showLegend
    ? Array.from(
        rows
          .flatMap((row) => row.segments)
          .filter((s) => s.percentage > 0)
          .reduce((map, s) => {
            if (!map.has(s.key)) map.set(s.key, s);
            return map;
          }, new Map<string, StackedBarSegment>())
          .values(),
      )
    : [];

  useEffect(() => {
    if (!svgRef.current || rows.length === 0 || barWidth === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = svg
      .append("g")
      .attr("transform", `translate(${PADDING}, ${PADDING})`);

    let cursorY = 0;
    rows.forEach((row, i) => {
      if (i > 0) cursorY += rowGap;
      const rowTitleHeight = row.title ? ROW_TITLE_HEIGHT : 0;

      const g = root
        .append("g")
        .attr("transform", `translate(0, ${cursorY + rowTitleHeight})`);

      if (row.title) {
        g.append("text")
          .attr("x", 0)
          .attr("y", -6)
          .style("font-size", "12px")
          .style("fill", rowTitleColor)
          .text(row.titleEmoji ? `${row.titleEmoji} ${row.title}` : row.title);
      }

      const segments = row.segments.filter((s) => s.percentage > 0);
      const totalPct = segments.reduce((sum, s) => sum + s.percentage, 0);
      const scale = normalize && totalPct > 0 ? 100 / totalPct : 1;

      let x = 0;
      segments.forEach((seg) => {
        const segW = Math.max(0, ((seg.percentage * scale) / 100) * barWidth);
        g.append("rect")
          .attr("x", x)
          .attr("y", 0)
          .attr("width", segW)
          .attr("height", barHeight)
          .attr("fill", seg.color)
          .style("cursor", "pointer")
          .on("mousemove", function (event: MouseEvent) {
            showTooltip(
              event,
              seg.tooltip ?? `${seg.label} : ${seg.percentage.toFixed(1)}%`,
            );
          })
          .on("mouseout", hideTooltip);

        if (segW >= minSegmentWidthForLabel) {
          g.append("text")
            .attr("x", x + segW / 2)
            .attr("y", barHeight / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "11px")
            .style("font-weight", 700)
            .style("fill", segmentLabelColor)
            .style("paint-order", "stroke fill")
            .style("stroke", "rgba(0,0,0,0.35)")
            .style("stroke-width", "3px")
            .style("pointer-events", "none")
            .text(`${seg.percentage.toFixed(0)}%`);
        }
        x += segW;
      });

      cursorY += rowTitleHeight + barHeight;
    });
  }, [
    rows,
    barWidth,
    barHeight,
    rowGap,
    normalize,
    minSegmentWidthForLabel,
    rowTitleColor,
    segmentLabelColor,
    showTooltip,
    hideTooltip,
  ]);

  if (rows.length === 0) return null;

  return (
    <div ref={containerRef} className="relative w-full">
      {(title ?? headerRight) && (
        <div className="mb-1 flex items-baseline justify-between">
          {title && (
            <div className="text-base font-bold" style={{ color: titleColor }}>
              {title}
            </div>
          )}
          {headerRight && (
            <div className="text-xs text-gray">{headerRight}</div>
          )}
        </div>
      )}
      {containerWidth > 0 && (
        <svg
          ref={svgRef}
          width={containerWidth}
          height={height}
          aria-hidden="true"
        />
      )}
      {showLegend && legendItems.length > 0 && (
        <ul className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray">
          {legendItems.map((item) => (
            <li key={item.key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-2.5 w-2.5 rounded-sm border border-black/10"
                style={{ backgroundColor: item.color }}
              />
              {item.emoji && <span aria-hidden="true">{item.emoji}</span>}
              {item.label}
            </li>
          ))}
        </ul>
      )}
      <div className="sr-only">
        <ul>
          {rows.map((row) => (
            <li key={row.id}>
              {row.title}
              <ul>
                {row.segments
                  .filter((s) => s.percentage > 0)
                  .map((s) => (
                    <li key={s.key}>
                      {s.label} : {s.percentage.toFixed(1)}%
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
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

export default StackedBarList;

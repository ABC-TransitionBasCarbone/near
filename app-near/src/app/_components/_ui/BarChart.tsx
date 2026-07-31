"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { colors } from "tailwind.config";

export interface BarChartItem {
  label: string | number;
  value: number;
  threshold: number;
}

interface BarChartProps {
  config: BarChartItem[];
  title?: string;
  yAxisLabel?: string;
  footerAction?: React.ReactNode;
  barHeight?: number;
  barGap?: number;
  labelWidth?: number;
  valueColor?: string;
  valueReachedColor?: string;
  trackColor?: string;
  trackFillColor?: string;
  thresholdColor?: string;
  labelColor?: string;
}

const PADDING = 16;
const MAX_DOMAIN_RATIO = 1.1;
const BAR_CORNER_RADIUS = 3;
const VALUE_BAR_HEIGHT_RATIO = 0.5;
const MIN_VALUE_BAR_WIDTH = 4;
const ARROW_HALF_WIDTH = 6;
const ARROW_HEIGHT = 8;
const THRESHOLD_LABEL_HEIGHT = 14;
const TOP_SPACE = ARROW_HEIGHT + THRESHOLD_LABEL_HEIGHT;
const VALUE_LABEL_WIDTH = 36;
const Y_AXIS_TITLE_WIDTH = 18;
const X_AXIS_TICKS_HEIGHT = 20;
const X_AXIS_TITLE_HEIGHT = 20;
const X_AXIS_SPACE = X_AXIS_TICKS_HEIGHT + X_AXIS_TITLE_HEIGHT;

const THRESHOLD_ARROW_PATH = `M 0,0 L ${-ARROW_HALF_WIDTH},${-ARROW_HEIGHT} L ${ARROW_HALF_WIDTH},${-ARROW_HEIGHT} Z`;

const BarChart: React.FC<BarChartProps> = ({
  config,
  title,
  yAxisLabel = "SU",
  footerAction,
  barHeight = 24,
  barGap = 30,
  labelWidth = 32,
  valueColor = colors.blue,
  valueReachedColor = colors.success,
  trackColor = colors.grayLight,
  trackFillColor = colors.grayExtraLight,
  thresholdColor = colors.black,
  labelColor = colors.gray,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  const chartLeftSpace = Y_AXIS_TITLE_WIDTH + labelWidth;
  const barWidth = Math.max(
    0,
    containerWidth - chartLeftSpace - VALUE_LABEL_WIDTH - PADDING * 2,
  );

  const maxDomain =
    Math.max(1, ...config.flatMap((item) => [item.value, item.threshold])) *
    MAX_DOMAIN_RATIO;

  const width = containerWidth;
  const chartHeight = config.length * (barHeight + barGap);
  const height = TOP_SPACE + chartHeight + X_AXIS_SPACE + PADDING * 2;

  useEffect(() => {
    if (!svgRef.current || config.length === 0 || barWidth === 0) {
      return;
    }

    const scale = d3
      .scaleLinear()
      .domain([0, maxDomain])
      .range([0, barWidth])
      .clamp(true);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const chartX = PADDING + chartLeftSpace;

    const root = svg
      .append("g")
      .attr("transform", `translate(${chartX}, ${PADDING + TOP_SPACE})`);

    const gridLines = root
      .append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(
        d3
          .axisBottom(scale)
          .ticks(5)
          .tickSize(-chartHeight)
          .tickFormat(() => ""),
      );

    gridLines.select(".domain").remove();
    gridLines
      .selectAll(".tick line")
      .attr("stroke", trackColor)
      .attr("stroke-dasharray", "2,2");

    const valueBarHeight = barHeight * VALUE_BAR_HEIGHT_RATIO;
    const valueBarCornerRadius = Math.min(
      BAR_CORNER_RADIUS,
      valueBarHeight / 2,
    );

    config.forEach((item, i) => {
      const y = i * (barHeight + barGap);
      const valueBarY = y + (barHeight - valueBarHeight) / 2;
      const valueBarWidth = Math.max(scale(item.value), MIN_VALUE_BAR_WIDTH);
      const thresholdReached = item.value >= item.threshold;

      root
        .append("text")
        .attr("x", -8)
        .attr("y", y + barHeight / 2)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 11)
        .attr("fill", labelColor)
        .text(String(item.label));

      root
        .append("rect")
        .attr("x", 0)
        .attr("y", y)
        .attr("width", scale(item.threshold))
        .attr("height", barHeight)
        .attr("rx", BAR_CORNER_RADIUS)
        .attr("fill", trackFillColor);

      root
        .append("rect")
        .attr("x", 0)
        .attr("y", valueBarY)
        .attr("width", valueBarWidth)
        .attr("height", valueBarHeight)
        .attr("rx", valueBarCornerRadius)
        .attr("fill", thresholdReached ? valueReachedColor : valueColor);

      root
        .append("text")
        .attr("x", valueBarWidth + 6)
        .attr("y", y + barHeight / 2)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 11)
        .attr("font-weight", 700)
        .attr("fill", thresholdReached ? valueReachedColor : valueColor)
        .text(item.value);

      root
        .append("text")
        .attr("x", scale(item.threshold))
        .attr("y", y - ARROW_HEIGHT - 4)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("font-size", 10)
        .attr("fill", thresholdColor)
        .text(item.threshold);

      root
        .append("path")
        .attr("d", THRESHOLD_ARROW_PATH)
        .attr("fill", thresholdColor)
        .attr("stroke", colors.white)
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("transform", `translate(${scale(item.threshold)}, ${y})`);
    });

    svg
      .append("text")
      .attr("x", PADDING + chartLeftSpace / 2)
      .attr("y", PADDING + TOP_SPACE - 15)
      .attr("text-anchor", "middle")
      .attr("font-size", 11)
      .attr("font-weight", 700)
      .attr("fill", labelColor)
      .text(yAxisLabel);

    const axisY = chartHeight;
    const axis = root
      .append("g")
      .attr("transform", `translate(0, ${axisY})`)
      .call(d3.axisBottom(scale).ticks(5));

    axis.select(".domain").attr("stroke", trackColor);
    axis.selectAll(".tick line").attr("stroke", trackColor);
    axis.selectAll(".tick text").attr("font-size", 10).attr("fill", labelColor);

    root
      .append("text")
      .attr("x", barWidth / 2)
      .attr("y", axisY + X_AXIS_TICKS_HEIGHT + X_AXIS_TITLE_HEIGHT / 2)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("font-size", 11)
      .attr("fill", labelColor)
      .text("Personnes interrogées");
  }, [
    config,
    maxDomain,
    barWidth,
    barHeight,
    barGap,
    chartLeftSpace,
    chartHeight,
    yAxisLabel,
    valueColor,
    valueReachedColor,
    trackColor,
    trackFillColor,
    thresholdColor,
    labelColor,
  ]);

  const header = title && (
    <div className="mb-1 text-center text-3xl">{title}</div>
  );

  if (config.length === 0) {
    return (
      <div className="flex w-full flex-col items-center gap-2">
        {header}
        <div
          style={{ height }}
          className="w-full animate-pulse rounded bg-grayExtraLight"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex w-full flex-col items-center gap-2">
      {header}
      {containerWidth > 0 && (
        <svg ref={svgRef} width={width} height={height} aria-hidden="true" />
      )}
      <ul className="sr-only">
        {config.map((item) => (
          <li key={item.label}>
            {item.label} : {item.value} sur un seuil de {item.threshold}
            {item.value >= item.threshold
              ? " (seuil atteint)"
              : " (seuil non atteint)"}
          </li>
        ))}
      </ul>
      <div className="flex w-full items-center justify-around text-xs">
        <div
          className="flex items-center gap-1.5"
          style={{ color: thresholdColor }}
        >
          <svg width="12" height="8" viewBox="-6 -8 12 8" aria-hidden="true">
            <path
              d={THRESHOLD_ARROW_PATH}
              fill={thresholdColor}
              stroke={colors.white}
              strokeWidth={1}
            />
          </svg>
          <span>Seuil à atteindre pour la SU</span>
        </div>
        {footerAction}
      </div>
    </div>
  );
};

export default BarChart;

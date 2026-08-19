"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { USAGE_FIELDS, USAGE_QUESTIONS } from "~/shared/services/dataviz/usage";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import { getD3Tooltip } from "../hooks/useD3Tooltip";

interface DvUsagesProps {
  selectedSus?: number[];
}

interface UsageData {
  value: string;
  label: string;
  shortLabel: string;
  emoji: string;
  count: number;
  percentage: number;
}

interface UsageQuestion {
  title: string;
  emoji: string;
  data: UsageData[];
}

const DvUsages: React.FC<DvUsagesProps> = ({ selectedSus }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: svgContainer, width, height } = useChartDimensions();
  const { colorMain: mainColor, colorDark1: darkColor1 } =
    useSuBank(selectedSus);

  const meatFrequency = api.suDataviz.getUsageDistribution.useQuery({
    field: "meatFrequency",
    selectedSus,
  });
  const transportationMode = api.suDataviz.getUsageDistribution.useQuery({
    field: "transportationMode",
    selectedSus,
  });
  const digitalIntensity = api.suDataviz.getUsageDistribution.useQuery({
    field: "digitalIntensity",
    selectedSus,
  });
  const purchasingStrategy = api.suDataviz.getUsageDistribution.useQuery({
    field: "purchasingStrategy",
    selectedSus,
  });
  const airTravelFrequency = api.suDataviz.getUsageDistribution.useQuery({
    field: "airTravelFrequency",
    selectedSus,
  });
  const heatSource = api.suDataviz.getUsageDistribution.useQuery({
    field: "heatSource",
    selectedSus,
  });

  const queries = [
    meatFrequency,
    transportationMode,
    digitalIntensity,
    purchasingStrategy,
    airTravelFrequency,
    heatSource,
  ];
  const loading = queries.some((q) => q.isLoading);
  const error = queries.some((q) => q.error);

  const data: UsageQuestion[] = USAGE_FIELDS.map((field, i) => ({
    title: USAGE_QUESTIONS[field].title,
    emoji: USAGE_QUESTIONS[field].emoji,
    data: queries[i]?.data?.data ?? [],
  })).filter((question) => question.data.length > 0);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const tooltip = getD3Tooltip(document.body);

    const fallbackWidth = 300;
    const fallbackHeight = 250;

    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: 20,
      containerWidth: 0,
      containerHeight: 0,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const container = svg
      .append("g")
      .attr("class", "container")
      .attr(
        "transform",
        `translate(${dimensions.margins}, ${dimensions.margins})`,
      );

    svg
      .append("text")
      .attr("x", dimensions.margins)
      .attr("y", 20)
      .attr("class", "dv-title")
      .style("fill", mainColor)
      .text("🔮 Habitudes de consommation");

    const titleHeight = 30;
    const gapBetweenSections = 15;
    const availableHeight =
      dimensions.containerHeight -
      titleHeight -
      gapBetweenSections * (data.length - 1);
    const categoryHeight = availableHeight / data.length;
    const subtitleHeight = 25;
    const emojiHeight = 15;
    const percentageHeight = 12;
    const spacingBetweenSubtitleAndViolin = 10 + emojiHeight;
    const spacingAfterViolin = percentageHeight + 10;
    const violinAreaHeight =
      categoryHeight -
      subtitleHeight -
      spacingBetweenSubtitleAndViolin -
      spacingAfterViolin;
    const violinWidth = dimensions.containerWidth * 0.8;
    const violinStartX = (dimensions.containerWidth - violinWidth) / 2;

    const globalMaxPercentage =
      d3.max(
        data.flatMap((question) => question.data.map((d) => d.percentage)),
      ) ?? 100;

    data.forEach((question, questionIndex) => {
      const categoryY =
        titleHeight + questionIndex * (categoryHeight + gapBetweenSections);
      const categoryGroup = container
        .append("g")
        .attr("class", "usage-category")
        .attr("transform", `translate(0, ${categoryY})`);

      categoryGroup
        .append("text")
        .attr("x", dimensions.containerWidth / 2)
        .attr("y", subtitleHeight / 2)
        .attr("class", "category-subtitle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("fill", mainColor)
        .style("text-anchor", "middle")
        .style("dominant-baseline", "middle")
        .text(`${question.emoji} ${question.title}`);

      const violinData = question.data.slice(0, 3);
      if (violinData.length !== 3) {
        return;
      }

      const violinGroup = categoryGroup
        .append("g")
        .attr("class", "violin-group")
        .attr(
          "transform",
          `translate(0, ${subtitleHeight + spacingBetweenSubtitleAndViolin})`,
        );

      const segmentSpacing = violinWidth / 2;
      const leftX = violinStartX;
      const centerX = violinStartX + segmentSpacing;
      const rightX = violinStartX + violinWidth;

      const heightScale = d3
        .scaleLinear()
        .domain([0, globalMaxPercentage])
        .range([0, violinAreaHeight / 2]);

      const horizonY = violinAreaHeight / 2;

      const leftHeight = heightScale(violinData[0]?.percentage ?? 0);
      const centerHeight = heightScale(violinData[1]?.percentage ?? 0);
      const rightHeight = heightScale(violinData[2]?.percentage ?? 0);

      const violinPath = d3.path();

      violinPath.moveTo(leftX, horizonY - leftHeight);

      violinPath.bezierCurveTo(
        leftX + segmentSpacing * 0.3,
        horizonY - leftHeight,
        centerX - segmentSpacing * 0.3,
        horizonY - centerHeight,
        centerX,
        horizonY - centerHeight,
      );

      violinPath.bezierCurveTo(
        centerX + segmentSpacing * 0.3,
        horizonY - centerHeight,
        rightX - segmentSpacing * 0.3,
        horizonY - rightHeight,
        rightX,
        horizonY - rightHeight,
      );

      violinPath.lineTo(rightX, horizonY + rightHeight);

      violinPath.bezierCurveTo(
        rightX - segmentSpacing * 0.3,
        horizonY + rightHeight,
        centerX + segmentSpacing * 0.3,
        horizonY + centerHeight,
        centerX,
        horizonY + centerHeight,
      );

      violinPath.bezierCurveTo(
        centerX - segmentSpacing * 0.3,
        horizonY + centerHeight,
        leftX + segmentSpacing * 0.3,
        horizonY + leftHeight,
        leftX,
        horizonY + leftHeight,
      );

      violinPath.closePath();

      violinGroup
        .append("path")
        .attr("d", violinPath.toString())
        .attr("fill", mainColor)
        .attr("opacity", 0.7)
        .attr("stroke", darkColor1)
        .attr("stroke-width", 1);

      const segments = [
        { x: leftX, height: leftHeight, data: violinData[0] },
        { x: centerX, height: centerHeight, data: violinData[1] },
        { x: rightX, height: rightHeight, data: violinData[2] },
      ].filter((segment) => segment.data);

      segments.forEach((segment) => {
        const segmentGroup = violinGroup
          .append("g")
          .attr("class", "segment-group");

        segmentGroup
          .append("line")
          .attr("x1", segment.x)
          .attr("y1", horizonY - segment.height)
          .attr("x2", segment.x)
          .attr("y2", horizonY + segment.height)
          .attr("stroke", darkColor1)
          .attr("stroke-width", 2)
          .attr("opacity", 0);

        if (!segment.data) return;

        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY - segment.height - 15)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .text(segment.data.emoji);

        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY + segment.height + 18)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("fill", darkColor1)
          .text(`${segment.data.percentage.toFixed(0)}%`);

        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "11px")
          .style("font-weight", "bold")
          .style("fill", darkColor1)
          .style("stroke", "white")
          .style("stroke-width", "3px")
          .style("paint-order", "stroke fill")
          .text(segment.data.shortLabel);

        const bbox = (segmentGroup.node() as SVGGraphicsElement).getBBox();
        const tooltipPadding = 6;
        const minTooltipAreaWidth = 60;
        const tooltipAreaWidth = Math.max(
          bbox.width + tooltipPadding * 2,
          minTooltipAreaWidth,
        );
        const tooltipAreaCenterX = bbox.x + bbox.width / 2;
        const tooltipArea = segmentGroup
          .append("rect")
          .attr("x", tooltipAreaCenterX - tooltipAreaWidth / 2)
          .attr("y", bbox.y - tooltipPadding)
          .attr("width", tooltipAreaWidth)
          .attr("height", bbox.height + tooltipPadding * 2)
          .attr("fill", "transparent")
          .style("cursor", "pointer");

        tooltipArea
          .on("mouseover", function (event: MouseEvent) {
            tooltip
              .html(
                `
                <div><strong>${question.emoji} ${question.title}</strong></div>
                <div>${segment.data?.emoji ?? ""} ${segment.data?.label ?? ""}</div>
                <div>${segment.data?.percentage.toFixed(1) ?? "0"}% (${segment.data?.count ?? 0} réponses)</div>
              `,
              )
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY - 10}px`);

            tooltip.transition().duration(200).style("opacity", 1);

            d3.select(segmentGroup.node()).select("line").attr("opacity", 0.3);
          })
          .on("mouseout", function () {
            tooltip.transition().duration(200).style("opacity", 0);

            d3.select(segmentGroup.node()).select("line").attr("opacity", 0);
          });
      });
    });
  }, [data, mainColor, darkColor1, width, height]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray">Chargement des données d&apos;usage...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-error">
        Erreur lors du chargement des données
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray">
        Aucune donnée d&apos;usage disponible
      </div>
    );
  }

  return (
    <div ref={svgContainer} className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" aria-hidden="true" />
      <div className="sr-only">
        <ul>
          {data.map((question) => (
            <li key={question.title}>
              {question.title}
              <ul>
                {question.data.map((d) => (
                  <li key={d.value}>
                    {d.label} : {d.percentage.toFixed(1)}% ({d.count})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DvUsages;

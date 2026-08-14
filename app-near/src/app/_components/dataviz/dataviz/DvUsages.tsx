"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";

interface DvUsagesProps {
  selectedSus?: number[];
}

interface UsageData {
  value: string;
  label: string;
  emoji: string;
  count: number;
  percentage: number;
}

interface UsageQuestion {
  title: string;
  emoji: string;
  data: UsageData[];
}

const USAGE_QUESTIONS: { field: string; title: string; emoji: string }[] = [
  { field: "meatFrequency", title: "Consommation de viande", emoji: "🥩" },
  { field: "transportationMode", title: "Mode de transport", emoji: "🚗" },
  { field: "digitalIntensity", title: "Intensité numérique", emoji: "📱" },
  { field: "purchasingStrategy", title: "Stratégie d'achat", emoji: "🛍️" },
  {
    field: "airTravelFrequency",
    title: "Fréquence de voyage aérien",
    emoji: "✈️",
  },
  { field: "heatSource", title: "Source de chauffage", emoji: "🔥" },
];

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

  const data: UsageQuestion[] = USAGE_QUESTIONS.map((question, i) => ({
    title: question.title,
    emoji: question.emoji,
    data: queries[i]?.data?.data ?? [],
  })).filter((question) => question.data.length > 0);

  // D3 Violin Chart
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // fallback dimensions
    const fallbackWidth = 300;
    const fallbackHeight = 250;

    // Dimensions (ResponsiveD3 pattern)
    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: 20,
      containerWidth: 0,
      containerHeight: 0,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    // Set SVG dimensions
    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const container = svg
      .append("g")
      .attr("class", "container")
      .attr(
        "transform",
        `translate(${dimensions.margins}, ${dimensions.margins})`,
      );

    // Add main title
    svg
      .append("text")
      .attr("x", dimensions.margins)
      .attr("y", 20)
      .attr("class", "dv-title")
      .style("fill", mainColor)
      .text("🔮 Habitudes de consommation");

    // Calculate layout for each usage category
    const titleHeight = 30; // Space for main title
    const gapBetweenSections = 15; // Gap entre chaque section sous-titre + violin
    const availableHeight =
      dimensions.containerHeight -
      titleHeight -
      gapBetweenSections * (data.length - 1);
    const categoryHeight = availableHeight / data.length;
    const subtitleHeight = 25; // Espace pour le sous-titre
    const emojiHeight = 15; // Hauteur approximative des emojis (font-size: 12px + marge)
    const percentageHeight = 12; // Hauteur approximative des pourcentages (font-size: 10px + marge)
    const spacingBetweenSubtitleAndViolin = 10 + emojiHeight; // Espace supplémentaire incluant la taille des emojis
    const spacingAfterViolin = percentageHeight + 10; // Espace après les violins pour % seulement (labels sur horizon)
    const violinAreaHeight =
      categoryHeight -
      subtitleHeight -
      spacingBetweenSubtitleAndViolin -
      spacingAfterViolin;
    const violinWidth = dimensions.containerWidth * 0.8; // 80% of width for violin
    const violinStartX = (dimensions.containerWidth - violinWidth) / 2;

    // Calcul max percentage pour toutes questions (échelle commune)
    const globalMaxPercentage =
      d3.max(
        data.flatMap((question) => question.data.map((d) => d.percentage)),
      ) ?? 100;

    // violin chart pour chaque catégorie d'usage / question
    data.forEach((question, questionIndex) => {
      const categoryY =
        titleHeight + questionIndex * (categoryHeight + gapBetweenSections);
      const categoryGroup = container
        .append("g")
        .attr("class", "usage-category")
        .attr("transform", `translate(0, ${categoryY})`);

      // Sous-titres par question
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

      // Attend 3 points de données pour le ventre/violon (gauche, centre, droite)
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

      // Positions des segments
      const segmentSpacing = violinWidth / 2;
      const leftX = violinStartX;
      const centerX = violinStartX + segmentSpacing;
      const rightX = violinStartX + violinWidth;

      // Utilise le max global pour l'échelle de hauteur
      const heightScale = d3
        .scaleLinear()
        .domain([0, globalMaxPercentage])
        .range([0, violinAreaHeight / 2]);

      // Utils ligne d'horizon, non affichée, positionne les labels
      const horizonY = violinAreaHeight / 2;

      // Calculate segment heights
      const leftHeight = heightScale(violinData[0]?.percentage ?? 0);
      const centerHeight = heightScale(violinData[1]?.percentage ?? 0);
      const rightHeight = heightScale(violinData[2]?.percentage ?? 0);

      // Create violin shape using path with Bézier curves
      const violinPath = d3.path();

      // Début top-left
      violinPath.moveTo(leftX, horizonY - leftHeight);

      // Bézier vers top-center
      violinPath.bezierCurveTo(
        leftX + segmentSpacing * 0.3,
        horizonY - leftHeight,
        centerX - segmentSpacing * 0.3,
        horizonY - centerHeight,
        centerX,
        horizonY - centerHeight,
      );

      // Bézier vers top-right
      violinPath.bezierCurveTo(
        centerX + segmentSpacing * 0.3,
        horizonY - centerHeight,
        rightX - segmentSpacing * 0.3,
        horizonY - rightHeight,
        rightX,
        horizonY - rightHeight,
      );

      // Segment bas droite
      violinPath.lineTo(rightX, horizonY + rightHeight);

      // Bézier vers bottom-center
      violinPath.bezierCurveTo(
        rightX - segmentSpacing * 0.3,
        horizonY + rightHeight,
        centerX + segmentSpacing * 0.3,
        horizonY + centerHeight,
        centerX,
        horizonY + centerHeight,
      );

      // Bézier vers bottom-left
      violinPath.bezierCurveTo(
        centerX - segmentSpacing * 0.3,
        horizonY + centerHeight,
        leftX + segmentSpacing * 0.3,
        horizonY + leftHeight,
        leftX,
        horizonY + leftHeight,
      );

      // Close path
      violinPath.closePath();

      // violinShape à partir du path
      violinGroup
        .append("path")
        .attr("d", violinPath.toString())
        .attr("fill", mainColor)
        .attr("opacity", 0.7)
        .attr("stroke", darkColor1)
        .attr("stroke-width", 1);

      // Segments verticaux + emojis + labels + pourcentages
      const segments = [
        { x: leftX, height: leftHeight, data: violinData[0] },
        { x: centerX, height: centerHeight, data: violinData[1] },
        { x: rightX, height: rightHeight, data: violinData[2] },
      ].filter((segment) => segment.data); // Filter out undefined data

      segments.forEach((segment) => {
        const segmentGroup = violinGroup
          .append("g")
          .attr("class", "segment-group");

        // Utils lingne verticale au centre du segment (non affichée)
        segmentGroup
          .append("line")
          .attr("x1", segment.x)
          .attr("y1", horizonY - segment.height)
          .attr("x2", segment.x)
          .attr("y2", horizonY + segment.height)
          .attr("stroke", darkColor1)
          .attr("stroke-width", 2)
          .attr("opacity", 0); // Masqué - seule l'aire est visible

        if (!segment.data) return;

        // Emoji
        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY - segment.height - 15)
          .attr("text-anchor", "middle")
          .style("font-size", "12px")
          .text(segment.data.emoji);

        // %
        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY + segment.height + 18)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .style("font-weight", "bold")
          .style("fill", darkColor1)
          .text(`${segment.data.percentage.toFixed(0)}%`);

        // Label
        segmentGroup
          .append("text")
          .attr("x", segment.x)
          .attr("y", horizonY)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "11px")
          .style("font-weight", "bold")
          .style("fill", "white")
          .style("text-shadow", "2px 2px 2px rgba(0,0,0,0.8)")
          .text(
            segment.data.label.length > 10
              ? `${segment.data.label.substring(0, 10)}...`
              : segment.data.label,
          );

        // Util tooltip area
        const tooltipArea = segmentGroup
          .append("rect")
          .attr("x", segment.x - 25)
          .attr("y", Math.min(horizonY - segment.height - 20, 0))
          .attr("width", 50)
          .attr(
            "height",
            Math.abs(horizonY - segment.height - 20) +
              Math.abs(horizonY + segment.height + 25),
          )
          .attr("fill", "transparent")
          .style("cursor", "pointer");

        // Tooltip interactions
        tooltipArea
          .on("mouseover", function (event: MouseEvent) {
            const tooltip = d3
              .select("body")
              .append("div")
              .attr("class", "segment-tooltip")
              .style("position", "absolute")
              .style("background", "rgba(0,0,0,0.8)")
              .style("color", "white")
              .style("padding", "8px")
              .style("border-radius", "4px")
              .style("font-size", "12px")
              .style("pointer-events", "none")
              .style("z-index", "9999")
              .style("opacity", 0);

            tooltip.transition().duration(200).style("opacity", 1);

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

            d3.select(segmentGroup.node()).select("line").attr("opacity", 0.3);
          })
          .on("mouseout", function () {
            d3.selectAll(".segment-tooltip")
              .transition()
              .duration(200)
              .style("opacity", 0)
              .remove();

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
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
};

export default DvUsages;

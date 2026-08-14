"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";

interface DvAgeDistributionProps {
  selectedSus?: number[];
}

const TITLE = "Tranches d'âges";
const TITLE_EMOJI = "🧒👵";

const DvAgeDistribution: React.FC<DvAgeDistributionProps> = ({
  selectedSus,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: svgContainer, width, height } = useChartDimensions();
  const { colorMain: mainColor, colorLight3: lightColor3 } =
    useSuBank(selectedSus);

  const {
    data: result,
    isLoading: loading,
    error,
  } = api.suDataviz.getSuAnswerDistribution.useQuery({
    field: "ageCategory",
    selectedSus,
  });
  const data = result?.data.filter((d) => d.count > 0);

  // D3 Dataviz
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Use fallback dimensions if responsive dimensions not yet available
    const fallbackWidth = 400;
    const fallbackHeight = 200;

    // Dimensions following ResponsiveD3 pattern
    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const chartWidth =
      dimensions.width - dimensions.margins.left - dimensions.margins.right;
    const chartHeight =
      dimensions.height -
      dimensions.margins.top * 2 -
      dimensions.margins.bottom * 2;

    // Set SVG dimensions
    svg.attr("width", chartWidth).attr("height", chartHeight);

    const g = svg.append("g").attr(
      "transform",
      `translate(
        ${dimensions.margins.left},
        ${dimensions.margins.top * 2.5}
        )`,
    );

    // Create scales for line chart
    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.percentage) ?? 100])
      .range([chartHeight, 0]);

    // Create line generator
    const line = d3
      .line<(typeof data)[0]>()
      .x((d) => xScale(d.label) ?? 0)
      .y((d) => yScale(d.percentage))
      .curve(d3.curveCardinal.tension(0.3));

    // Create area generator for fill
    const area = d3
      .area<(typeof data)[0]>()
      .x((d) => xScale(d.label) ?? 0)
      .y0(chartHeight)
      .y1((d) => yScale(d.percentage))
      .curve(d3.curveCardinal.tension(0.3));

    // Add area fill
    g.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", lightColor3)
      .attr("opacity", 0.6);

    // Add line
    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", mainColor)
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

    // Add data points
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.label) ?? 0)
      .attr("cy", (d) => yScale(d.percentage))
      .attr("r", 5)
      .attr("fill", mainColor)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function (event: MouseEvent, d) {
        // Tooltip on hover
        const tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("position", "absolute")
          .style("background", "rgba(0,0,0,0.8)")
          .style("color", "white")
          .style("padding", "8px")
          .style("border-radius", "4px")
          .style("font-size", "12px")
          .style("pointer-events", "none")
          .style("z-index", "9999");

        tooltip
          .html(
            `
          <div><strong>${d.label}</strong></div>
          <div>${d.percentage.toFixed(1)}% (${d.count})</div>
        `,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);

        // Highlight point
        d3.select(this)
          .attr("r", 7)
          .attr("stroke", mainColor)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        // Remove tooltip
        d3.selectAll(".tooltip").remove();

        // Reset point style
        d3.select(this)
          .attr("r", 5)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      });

    // Add percentage labels on points
    g.selectAll(".point-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "point-label")
      .attr("x", (d) => xScale(d.label) ?? 0)
      .attr("y", (d) => yScale(d.percentage) - 10)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", mainColor)
      .text((d) => `${d.percentage.toFixed(0)}%`);

    // Add X axis
    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).offset(10))
      .selectAll("path,line,text")
      .attr("stroke-opacity", 0)
      .attr("class", "dv-x-axis-label")
      .style("text-anchor", "middle")
      .attr("margin-top", "30px")
      .attr("color", mainColor)
      .attr("dx", "-.8em")
      .attr("dy", ".50em");

    // Add title
    svg
      .append("text")
      .attr("x", dimensions.margins.left)
      .attr("y", 25)
      .attr("class", "dv-title")
      .style("fill", mainColor)
      .text(`${TITLE} ${TITLE_EMOJI}`);
  }, [data, width, height, mainColor, lightColor3]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray">Chargement des données d&apos;âge...</div>
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
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <div ref={svgContainer} className="h-full w-full">
      <svg ref={svgRef} className="h-full w-full" />
    </div>
  );
};

export default DvAgeDistribution;

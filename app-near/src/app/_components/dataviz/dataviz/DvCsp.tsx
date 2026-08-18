"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank, getPalette } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";

interface DvCspProps {
  selectedSus?: number[];
}

const TITLE = "Catégories socio-professionnelles";
const TITLE_EMOJI = "💼";

const DvCsp: React.FC<DvCspProps> = ({ selectedSus }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { containerRef: svgContainer, width } = useChartDimensions();
  const suBank = useSuBank(selectedSus);
  const mainColor = suBank.colorMain;
  const colors = useMemo(() => getPalette(suBank, "graph"), [suBank]);

  const {
    data: result,
    isLoading: loading,
    error,
  } = api.suDataviz.getSuAnswerDistribution.useQuery({
    field: "professionalCategory",
    selectedSus,
  });
  const data = result?.data.filter((d) => d.count > 0);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const fallbackWidth = 400;

    const dimensions = {
      width: width ?? fallbackWidth,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const chartWidth =
      dimensions.width - dimensions.margins.left - dimensions.margins.right;
    const barHeight = 40;
    const legendGap = 12;

    svg.attr("width", dimensions.width);

    let cumulative = 0;
    const stackedData = data.map((d) => {
      const start = cumulative;
      cumulative += d.percentage;
      return {
        ...d,
        start,
        end: cumulative,
      };
    });

    const xScale = d3.scaleLinear().domain([0, 100]).range([0, chartWidth]);

    const g = svg.append("g").attr(
      "transform",
      `translate(
        ${dimensions.margins.left},
        ${dimensions.margins.top + barHeight / 3}
        )`,
    );

    const bars = g
      .selectAll(".csp-bar")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "csp-bar");

    bars
      .append("rect")
      .attr("x", (d) => xScale(d.start))
      .attr("y", 0)
      .attr("width", (d) => xScale(d.end - d.start))
      .attr("height", barHeight)
      .attr(
        "fill",
        (d, i) => colors[i % colors.length] ?? colors[0] ?? mainColor,
      )
      .attr("stroke", "#fff")
      .attr("stroke-width", 1)
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
          <div><strong>${d.emoji} ${d.label}</strong></div>
          <div>${d.percentage.toFixed(1)}% (${d.count} ${result?.isNeighborhood ? "habitants" : "réponses"})</div>
        `,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);

        d3.select(this).attr("stroke", "#333").attr("stroke-width", 2);
      })
      .on("mouseout", function () {
        d3.selectAll(".tooltip").remove();

        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
      });

    bars
      .append("text")
      .attr("x", (d) => xScale(d.start + (d.end - d.start) / 2))
      .attr("y", barHeight / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
      .text((d) => {
        const segmentWidth = xScale(d.end - d.start);
        return segmentWidth > 40 ? `${d.percentage.toFixed(0)}%` : "";
      });

    const legendY =
      dimensions.margins.top + barHeight / 3 + barHeight + legendGap;

    const legend = svg
      .append("foreignObject")
      .attr("x", dimensions.margins.left)
      .attr("y", legendY)
      .attr("width", chartWidth);

    const legendContainer = legend
      .append("xhtml:div")
      .style("display", "flex")
      .style("flex-wrap", "wrap")
      .style("gap", "8px")
      .style("align-items", "center")
      .style("font-family", "system-ui, sans-serif")
      .style("line-height", "1.2");

    const legendItems = legendContainer
      .selectAll(".legend-item")
      .data(data)
      .enter()
      .append("xhtml:div")
      .attr("class", "legend-item")
      .style("display", "inline-flex")
      .style("align-items", "center")
      .style("gap", "5px")
      .style("font-size", "14px")
      .style("font-weight", "500")
      .style("color", "#333");

    legendItems
      .append("xhtml:div")
      .style("width", "12px")
      .style("height", "12px")
      .style("border-radius", "2px")
      .style("border", "1px solid #ccc")
      .style("flex-shrink", "0")
      .style(
        "background-color",
        (d, i) => colors[i % colors.length] ?? colors[0] ?? mainColor,
      );

    legendItems.append("xhtml:span").text((d) => {
      const labelText =
        d.label.length > 25 ? `${d.label.substring(0, 25)}...` : d.label;
      return `${d.emoji || ""} ${labelText}`.trim();
    });

    const legendHeight =
      (legendContainer.node() as HTMLDivElement | null)?.getBoundingClientRect()
        .height ?? 0;
    legend.attr("height", legendHeight);

    svg.attr("height", legendY + legendHeight + dimensions.margins.bottom);

    svg
      .append("text")
      .attr("x", dimensions.margins.left)
      .attr("y", dimensions.margins.top)
      .attr("class", "dv-title")
      .style("fill", mainColor)
      .text(`${TITLE} ${TITLE_EMOJI}`);
  }, [data, colors, mainColor, width, result?.isNeighborhood]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray">Chargement des données CSP...</div>
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
    <div ref={svgContainer} className="w-full">
      <svg ref={svgRef} className="block w-full" />
    </div>
  );
};

export default DvCsp;

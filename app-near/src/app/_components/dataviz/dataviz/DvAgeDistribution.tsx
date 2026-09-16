"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import { getD3Tooltip } from "../hooks/useD3Tooltip";
import DvAsync from "./DvAsync";

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

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    const tooltip = getD3Tooltip(document.body);
    const fallbackWidth = 400;
    const fallbackHeight = 200;

    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    const chartWidth =
      dimensions.width - dimensions.margins.left - dimensions.margins.right;
    const chartHeight =
      dimensions.height - dimensions.margins.top - dimensions.margins.bottom;

    svg
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g").attr(
      "transform",
      `translate(
        ${dimensions.margins.left},
        ${dimensions.margins.top}
        )`,
    );

    const xScale = d3
      .scalePoint()
      .domain(data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.percentage) ?? 100])
      .range([chartHeight, 0]);

    const line = d3
      .line<(typeof data)[0]>()
      .x((d) => xScale(d.label) ?? 0)
      .y((d) => yScale(d.percentage))
      .curve(d3.curveCardinal.tension(0.3));

    const area = d3
      .area<(typeof data)[0]>()
      .x((d) => xScale(d.label) ?? 0)
      .y0(chartHeight)
      .y1((d) => yScale(d.percentage))
      .curve(d3.curveCardinal.tension(0.3));

    g.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area)
      .attr("fill", lightColor3)
      .attr("opacity", 0.6);

    g.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", mainColor)
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round");

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
        tooltip
          .html(
            `
          <div><strong>${d.label}</strong></div>
          <div>${d.percentage.toFixed(1)}% (${d.count})</div>
        `,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .style("opacity", 1);

        d3.select(this)
          .attr("r", 7)
          .attr("stroke", mainColor)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);

        d3.select(this)
          .attr("r", 5)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2);
      });

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
  }, [data, width, height, mainColor, lightColor3]);

  return (
    <DvAsync
      loading={loading}
      error={error}
      isEmpty={!data || data.length === 0}
      messages={{ loading: "Chargement des données d’âge…" }}
      centered
    >
      <div className="flex h-full w-full flex-col">
        <div className="text-base font-bold" style={{ color: mainColor }}>
          {TITLE} <span aria-hidden="true">{TITLE_EMOJI}</span>
        </div>
        <div ref={svgContainer} className="min-h-0 flex-1">
          <svg ref={svgRef} className="h-full w-full" aria-hidden="true" />
          <ul className="sr-only">
            {data?.map((d) => (
              <li key={d.label}>
                {d.label} : {d.percentage.toFixed(1)}% ({d.count} personnes)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DvAsync>
  );
};

export default DvAgeDistribution;

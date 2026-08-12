"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";

interface DvGenreProps {
  selectedSus?: number[];
}

const TITLE = "Genre";
const TITLE_EMOJI = "🚻";

const DvGenre: React.FC<DvGenreProps> = ({ selectedSus }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const svgContainer = useRef<HTMLDivElement>(null);
  const {
    colorMain: mainColor,
    colorLight1: lightColor1,
    colorDark1: darkColor1,
  } = useSuBank(selectedSus);

  // State to track width and height of SVG Container
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const {
    data: result,
    isLoading: loading,
    error,
  } = api.suDataviz.getSuAnswerDistribution.useQuery({
    field: "gender",
    selectedSus,
  });
  const data = result?.data.filter((d) => d.count > 0);

  // This function calculates width and height of the container
  const getSvgContainerSize = () => {
    if (svgContainer.current) {
      const newWidth = svgContainer.current.clientWidth;
      const newHeight = svgContainer.current.clientHeight;
      setWidth(newWidth);
      setHeight(newHeight);
    }
  };

  useEffect(() => {
    // detect 'width' and 'height' on render
    getSvgContainerSize();
    // listen for resize changes, and detect dimensions again when they change
    window.addEventListener("resize", getSvgContainerSize);
    // cleanup event listener
    return () => window.removeEventListener("resize", getSvgContainerSize);
  }, []);

  // Additional effect to ensure dimensions are set after data loads
  useEffect(() => {
    if (data && svgContainer.current && (!width || !height)) {
      // Small delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        getSvgContainerSize();
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [data, width, height]);

  // D3 Pie Chart
  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content

    // Use fallback dimensions if responsive dimensions not yet available
    const fallbackWidth = 300;
    const fallbackHeight = 250;

    // Dimensions following ResponsiveD3 pattern
    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: 20,
      containerWidth: 0,
      containerHeight: 0,
    };

    dimensions.containerWidth = dimensions.width - dimensions.margins * 2;
    dimensions.containerHeight = dimensions.height - dimensions.margins * 2;

    // Calculate radius based on available space
    const radius =
      Math.min(dimensions.containerWidth, dimensions.containerHeight) * 0.5;

    // Set SVG dimensions
    svg.attr("width", dimensions.width).attr("height", dimensions.height);

    const container = svg
      .append("g")
      .attr("class", "container")
      .attr(
        "transform",
        `translate(${dimensions.margins}, ${dimensions.margins})`,
      );

    const g = container.append("g").attr(
      "transform",
      `translate(
        ${dimensions.containerWidth / 2},
        ${dimensions.containerHeight / 2 + dimensions.margins / 2}
        )`,
    );

    // Create pie generator
    const pie = d3
      .pie<(typeof data)[0]>()
      .value((d) => d.count)
      .sort(null); // Keep original order

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<(typeof data)[0]>>()
      .innerRadius(0)
      .outerRadius(radius);

    // Create arc data
    const arcs = pie(data);

    // Create pie slices
    const slices = g
      .selectAll(".slice")
      .data(arcs)
      .enter()
      .append("g")
      .attr("class", "slice");

    // Add paths for pie slices
    slices
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => (i === 0 ? lightColor1 : darkColor1))
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
          <div><strong>${d.data.label}</strong></div>
          <div>${d.data.percentage.toFixed(1)}% (${d.data.count})</div>
        `,
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);

        // Highlight slice
        d3.select(this).attr("stroke", mainColor).attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        // Remove tooltip
        d3.selectAll(".tooltip").remove();

        // Reset slice style
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 2);
      });

    // Add percentage labels on slices
    slices
      .append("text")
      .attr("transform", (d) => {
        const centroid = arc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "white")
      .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
      .text((d) =>
        d.data.percentage > 5
          ? `${d.data.emoji} ${d.data.percentage.toFixed(0)}%`
          : "",
      ); // Only show percentage if > 5%

    // Add title
    svg
      .append("text")
      .attr("x", dimensions.margins)
      .attr("y", 20)
      .attr("class", "dv-title")
      .style("fill", mainColor)
      .text(`${TITLE} ${TITLE_EMOJI}`);
  }, [data, mainColor, lightColor1, darkColor1, width, height]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Chargement des données de genre...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 flex h-64 items-center justify-center">
        Erreur lors du chargement des données
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-gray-500 flex h-64 items-center justify-center">
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

export default DvGenre;

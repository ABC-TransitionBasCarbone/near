"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import type { SatisfactionSubcategory } from "~/server/su/dataviz/satisfactionDistribution";

type Props = { selectedSus?: number[]; category?: SatisfactionSubcategory };

const DvEmdvSatisfactionsByCategory: React.FC<Props> = ({
  selectedSus,
  category,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const measure = () => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setWidth(Math.max(280, r.width));
    setHeight(Math.max(220, r.height));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const {
    data,
    isLoading: loading,
    error,
  } = api.suDataviz.getSatisfactionDistribution.useQuery({
    selectedSus,
    subcategory: category,
  });

  const questions = useMemo(
    () => data?.subcategories.flatMap((sc) => sc.questions) ?? [],
    [data],
  );

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    if (questions.length === 0 || !width || !height) return;

    const margin = { top: 28, right: 16, bottom: 24, left: 16 };
    const innerW = Math.max(200, width - margin.left - margin.right);
    const innerH = Math.max(140, height - margin.top - margin.bottom);
    svg.attr("width", width).attr("height", height);

    const root = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const rowH = 30;
    const gap = 24;
    const totalH = questions.length * (rowH + gap);
    const yStart = Math.max(0, (innerH - totalH) / 2);

    let tooltipNode =
      containerRef.current?.querySelector<HTMLDivElement>(".dv-tooltip");
    if (!tooltipNode && containerRef.current) {
      tooltipNode = document.createElement("div");
      containerRef.current.appendChild(tooltipNode);
    }
    const tooltipSel = d3
      .select(tooltipNode!)
      .attr("class", "dv-tooltip")
      .style("position", "absolute")
      .style("pointer-events", "none")
      .style("padding", "6px 8px")
      .style("font-size", "12px")
      .style("background", "rgba(0,0,0,0.75)")
      .style("color", "#fff")
      .style("border-radius", "4px")
      .style("opacity", 0);

    questions.forEach((q, i) => {
      const g = root
        .append("g")
        .attr("transform", `translate(0, ${yStart + i * (rowH + gap)})`);
      const segments = [
        { key: "NO", color: "#ffcdd2" },
        { key: "DONT_KNOW", color: "#f5f5f5" },
        { key: "YES", color: "#c8e6c9" },
      ];
      let x = 0;
      const barW = innerW;
      segments.forEach((seg) => {
        const resp = q.responses.find((r) => r.choice === seg.key);
        const pct = resp ? resp.percentage : 0;
        const w = (pct / 100) * barW;
        g.append("rect")
          .attr("x", x)
          .attr("y", 0)
          .attr("width", w)
          .attr("height", rowH)
          .attr("fill", seg.color)
          .style("cursor", "pointer")
          .on("mousemove", function (event: MouseEvent) {
            const rect = containerRef.current?.getBoundingClientRect();
            const px = rect
              ? event.pageX - (rect.left + window.scrollX)
              : event.pageX;
            const py = rect
              ? event.pageY - (rect.top + window.scrollY)
              : event.pageY;
            const label =
              seg.key === "YES"
                ? "Oui"
                : seg.key === "NO"
                  ? "Non"
                  : "Pas d'avis";
            tooltipSel
              .style("left", `${px + 10}px`)
              .style("top", `${py + 10}px`)
              .style("opacity", 1)
              .text(`${q.emoji} ${q.title} — ${label}: ${pct.toFixed(1)}%`);
          })
          .on("mouseout", function () {
            tooltipSel.style("opacity", 0);
          });
        if (pct >= 24) {
          g.append("text")
            .attr("x", x + w / 2)
            .attr("y", rowH / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "12px")
            .style("font-weight", "600")
            .style("fill", "#333")
            .text(`${pct.toFixed(0)}%`);
        }
        x += w;
      });
      g.append("text")
        .attr("x", 0)
        .attr("y", -6)
        .style("font-size", "12px")
        .style("fill", "#374151")
        .text(`${q.emoji} ${q.title}`);
    });
  }, [questions, width, height]);

  if (loading) {
    return (
      <div
        ref={containerRef}
        className="dv-container"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ padding: 12, color: "#666" }}>Chargement…</div>
        <svg ref={svgRef} />
      </div>
    );
  }
  if (error) {
    return (
      <div
        ref={containerRef}
        className="dv-container"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ padding: 12, color: "#b00020" }}>
          Impossible de charger les satisfactions
        </div>
        <svg ref={svgRef} />
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div
        ref={containerRef}
        className="dv-container"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ padding: 12, color: "#666" }}>Aucune donnée.</div>
        <svg ref={svgRef} />
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      className="dv-container"
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg ref={svgRef} />
    </div>
  );
};

export default DvEmdvSatisfactionsByCategory;

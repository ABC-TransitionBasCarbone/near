"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import {
  getFallbackIcon,
  validateAndSanitizeIcon,
} from "../../_services/sanitize/icons";

type Props = {
  selectedSus?: number[];
};

export default function DvSuTitle({ selectedSus }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const suBank = useSuBank(selectedSus);
  const { data: allSus, isLoading: susLoading } =
    api.suDataviz.getSuInfo.useQuery();
  const { data: survey, isLoading: surveyLoading } =
    api.surveys.getOne.useQuery();
  const loading = susLoading || surveyLoading;

  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const measure = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setWidth(Math.max(260, rect.width));
    setHeight(Math.max(100, rect.height));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isSu = selectedSus?.length === 1;
  const su = isSu ? allSus?.find((s) => s.su === selectedSus[0]) : undefined;

  const view = useMemo(
    () =>
      isSu
        ? su && {
            nameFr: su.bankData?.name ?? `SU n°${su.su}`,
            subtitle: `Sphère d'Usages n°${su.su}`,
            popPercentage: su.popPercentage,
          }
        : {
            nameFr: survey?.name ?? "Quartier",
            subtitle: "Quartier",
            popPercentage: 100,
          },
    [isSu, su, survey?.name],
  );

  const layout = useMemo(() => {
    if (!width || !height) return null;
    const margin = { top: 12, right: 12, bottom: 12, left: 12 };
    const iconSize = 72;
    const contentX = margin.left + iconSize + 12;
    const barWidth = Math.min(
      320,
      Math.max(120, width - margin.left - margin.right - iconSize - 12) - 60,
    );
    return { margin, iconSize, contentX, barWidth };
  }, [width, height]);

  // Render SVG
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const svg = d3.select(svgEl);
    svg.selectAll("*").remove();

    if (!view || !layout || !width || !height) return;

    const mainColor = suBank.colorMain;
    svg.attr("width", width).attr("height", height);

    const { margin, iconSize, contentX, barWidth } = layout;
    const root = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const helperBaselineY = iconSize;
    const barY = helperBaselineY - 24;

    // Left icon area (rounded rect background + ornament)
    const iconGroup = root.append("g");
    iconGroup
      .append("rect")
      .attr("width", iconSize)
      .attr("height", iconSize)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", mainColor)
      .attr("opacity", 0.12);

    const sanitized = validateAndSanitizeIcon(suBank.ornement);
    const ornamentMarkup = sanitized.isValid
      ? sanitized.sanitizedIcon
      : getFallbackIcon();

    const holder = iconGroup.append("g").attr("class", "ornament");
    holder.html(ornamentMarkup ?? "");
    try {
      const node = holder.node();
      if (node) {
        const bb = node.getBBox();
        const pad = 4;
        const availW = Math.max(1, iconSize - pad * 2);
        const availH = Math.max(1, iconSize - pad * 2);
        const scale = Math.min(
          availW / Math.max(1, bb.width),
          availH / Math.max(1, bb.height),
        );
        const tx = iconSize / 2 - (bb.x + bb.width / 2) * scale;
        const ty = iconSize / 2 - (bb.y + bb.height / 2) * scale;
        holder.attr("transform", `translate(${tx}, ${ty}) scale(${scale})`);
      }
    } catch {
      // Ignore sizing failures, keep the ornament at its default position
    }

    // Line 1: small subtitle
    root
      .append("text")
      .attr("x", contentX)
      .attr("y", 12)
      .style("font-size", "11px")
      .style("fill", "#6b7280")
      .text(view.subtitle);

    // Line 2: main name
    root
      .append("text")
      .attr("x", contentX)
      .attr("y", 34)
      .style("font-size", "16px")
      .style("font-weight", "600")
      .style("fill", mainColor)
      .text(view.nameFr);

    // Line 3: progress bar
    root
      .append("rect")
      .attr("x", contentX)
      .attr("y", barY)
      .attr("width", barWidth)
      .attr("height", 10)
      .attr("fill", "#e5e7eb")
      .attr("rx", 5)
      .attr("ry", 5);

    const pct = Math.max(0, Math.min(100, view.popPercentage));
    root
      .append("rect")
      .attr("x", contentX)
      .attr("y", barY)
      .attr("width", (pct / 100) * barWidth)
      .attr("height", 10)
      .attr("fill", mainColor)
      .attr("rx", 5)
      .attr("ry", 5);

    // Line 4: helper text
    root
      .append("text")
      .attr("x", contentX)
      .attr("y", barY + 24)
      .style("font-size", "11px")
      .style("fill", "#6b7280")
      .text(`${view.popPercentage.toFixed(1)}% de la population totale`);
  }, [view, layout, width, height, suBank]);

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

  if (!view) {
    return (
      <div
        ref={containerRef}
        className="dv-container"
        style={{ width: "100%", height: "100%" }}
      >
        <div style={{ padding: 12, color: "#666" }}>
          Aucune donnée disponible.
        </div>
        <svg ref={svgRef} />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="dv-container"
      style={{ width: "100%", height: "100%" }}
    >
      <svg ref={svgRef} />
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { useSuBank, getPalette } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import { getD3Tooltip } from "../hooks/useD3Tooltip";
import type { CarbonSankeyData } from "~/server/su/dataviz/carbonSankey";

type NodeItem = CarbonSankeyData["nodes"][number];
type ParentGroup = { root: NodeItem; children: NodeItem[] };
type Props = { selectedSus?: number[] };

const LABEL_W = 200;
const ROW_H = 36;
const LEGEND_H = 42; // flex legend — enough for ~2 wrapped lines
const ROW_STEP = ROW_H + LEGEND_H + 18; // bar + legend + gap
const MARGIN = { top: 40, right: 20, bottom: 20, left: 20 };
const FALLBACK_WIDTH = 900;

const DvCarbonStackedBars: React.FC<Props> = ({ selectedSus }) => {
  const { containerRef, container, width } = useChartDimensions();
  const svgRef = useRef<SVGSVGElement>(null);

  const suBank = useSuBank(selectedSus);
  const mainColor = suBank.colorMain;
  const palette = useMemo(() => getPalette(suBank, "graph"), [suBank]);

  const {
    data: payload,
    isLoading: loading,
    error,
  } = api.suDataviz.getCarbonSankey.useQuery({ selectedSus });
  const { data: globalMax } = api.suDataviz.getCarbonSankeyGlobalMax.useQuery();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!payload) return;

    const { nodes, links } = payload.sankeyData;
    if (!nodes.length) return;

    // Reconstruct parent groups: roots = nodes that are never a target
    const targetSet = new Set(links.map((l) => l.target));
    const parentGroups: ParentGroup[] = nodes
      .map((node, idx) => {
        if (targetSet.has(idx)) return null;
        const children = links
          .filter((l) => l.source === idx)
          .map((l) => nodes[l.target])
          .filter((n): n is NodeItem => !!n);
        if (!children.length) return null;
        return { root: node, children };
      })
      .filter((g): g is ParentGroup => g !== null)
      .sort((a, b) => b.root.value - a.root.value);

    if (!parentGroups.length) return;

    const chartWidth = width ?? FALLBACK_WIDTH;
    const maxVal = globalMax ?? 1;
    const barW = chartWidth - MARGIN.left - MARGIN.right - LABEL_W;
    const svgH = MARGIN.top + parentGroups.length * ROW_STEP + MARGIN.bottom;

    svg.attr("width", chartWidth).attr("height", svgH);

    const tooltip = getD3Tooltip(container).style("white-space", "nowrap");

    const root = svg
      .append("g")
      .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`);

    const totalTons = (payload.totalValue / 1000).toFixed(1);
    root
      .append("text")
      .attr("x", LABEL_W + barW / 2)
      .attr("y", -18)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", mainColor)
      .text(`☁ Empreinte individuelle moyenne : ${totalTons} t CO₂e / an`);

    root
      .append("text")
      .attr("x", LABEL_W + barW)
      .attr("y", -18)
      .attr("text-anchor", "end")
      .style("font-size", "11px")
      .style("fill", "#9ca3af")
      .text("kg CO₂e / an →");

    parentGroups.forEach((group, gi) => {
      const y = gi * ROW_STEP;
      const g = root.append("g").attr("transform", `translate(0, ${y})`);

      g.append("text")
        .attr("x", LABEL_W - 10)
        .attr("y", ROW_H / 2 - 6)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .style("font-size", "12px")
        .style("font-weight", "600")
        .style("fill", "#1f2937")
        .text(`${group.root.emoji} ${group.root.name}`);

      g.append("text")
        .attr("x", LABEL_W - 10)
        .attr("y", ROW_H / 2 + 10)
        .attr("text-anchor", "end")
        .attr("dominant-baseline", "central")
        .style("font-size", "10px")
        .style("fill", "#6b7280")
        .text(`${group.root.value.toFixed(0)} kg`);

      g.append("rect")
        .attr("x", LABEL_W)
        .attr("y", 0)
        .attr("width", barW)
        .attr("height", ROW_H)
        .attr("fill", "#f3f4f6")
        .attr("rx", 4);

      let xCursor = 0;
      const barTotalW = (group.root.value / maxVal) * barW;

      group.children.forEach((child, ci) => {
        const segW = Math.max(0, (child.value / maxVal) * barW);
        const color = palette[ci % palette.length]!;
        const isFirst = ci === 0;

        const x = LABEL_W + xCursor;
        const rx = 4;
        const isLastDrawn = xCursor + segW >= barTotalW - 1;

        let d: string;
        if (isFirst && isLastDrawn) {
          d = `M${x + rx},0 h${segW - rx * 2} a${rx},${rx} 0 0 1 ${rx},${rx} v${ROW_H - rx * 2} a${rx},${rx} 0 0 1 -${rx},${rx} h-${segW - rx * 2} a${rx},${rx} 0 0 1 -${rx},-${rx} v-${ROW_H - rx * 2} a${rx},${rx} 0 0 1 ${rx},-${rx} Z`;
        } else if (isFirst) {
          d = `M${x + rx},0 h${segW - rx} v${ROW_H} h-${segW - rx} a${rx},${rx} 0 0 1 -${rx},-${rx} v-${ROW_H - rx * 2} a${rx},${rx} 0 0 1 ${rx},-${rx} Z`;
        } else if (isLastDrawn) {
          d = `M${x},0 h${segW - rx} a${rx},${rx} 0 0 1 ${rx},${rx} v${ROW_H - rx * 2} a${rx},${rx} 0 0 1 -${rx},${rx} h-${segW - rx} Z`;
        } else {
          d = `M${x},0 h${segW} v${ROW_H} h-${segW} Z`;
        }

        g.append("path")
          .attr("d", d)
          .attr("fill", color)
          .style("cursor", "pointer")
          .on("mousemove", function (event: MouseEvent) {
            const rect = container?.getBoundingClientRect();
            const px = rect
              ? event.pageX - (rect.left + window.scrollX)
              : event.pageX;
            const py = rect
              ? event.pageY - (rect.top + window.scrollY)
              : event.pageY;
            const pct = ((child.value / group.root.value) * 100).toFixed(1);
            tooltip
              .style("left", `${px + 10}px`)
              .style("top", `${py - 32}px`)
              .style("opacity", 1)
              .text(
                `${child.emoji} ${child.name} — ${child.value.toFixed(0)} kg CO₂e (${pct}%)`,
              );
          })
          .on("mouseout", () => tooltip.style("opacity", 0));

        if (segW >= 28) {
          g.append("text")
            .attr("x", LABEL_W + xCursor + segW / 2)
            .attr("y", ROW_H / 2)
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "central")
            .style("font-size", "13px")
            .style("pointer-events", "none")
            .text(child.emoji);
        }

        xCursor += segW;
      });

      const fo = g
        .append("foreignObject")
        .attr("x", LABEL_W)
        .attr("y", ROW_H + 5)
        .attr("width", barW)
        .attr("height", LEGEND_H);

      const xmlns = "http://www.w3.org/1999/xhtml";
      const legendDiv = document.createElementNS(
        xmlns,
        "div",
      ) as HTMLDivElement;
      legendDiv.style.cssText =
        "display:flex;flex-wrap:wrap;gap:3px 14px;font-size:10px;color:#4b5563;line-height:1.5;";

      group.children.forEach((child, ci) => {
        const color = palette[ci % palette.length]!;
        const item = document.createElementNS(xmlns, "span");
        item.style.cssText =
          "display:inline-flex;align-items:center;gap:4px;white-space:nowrap;";

        const swatch = document.createElementNS(xmlns, "span");
        swatch.style.cssText = `display:inline-block;width:9px;height:9px;border-radius:2px;background:${color};flex-shrink:0;`;
        item.appendChild(swatch);

        const lbl = document.createElementNS(xmlns, "span");
        lbl.textContent = `${child.emoji} ${child.name} — ${child.value.toFixed(0)} kg`;
        item.appendChild(lbl);

        legendDiv.appendChild(item);
      });

      fo.node()!.appendChild(legendDiv);
    });
  }, [payload, palette, mainColor, globalMax, width, container]);

  if (loading) {
    return (
      <div ref={containerRef} className="dv-container relative w-full">
        <div className="p-3 text-gray">Chargement…</div>
        <svg ref={svgRef} />
      </div>
    );
  }
  if (error) {
    return (
      <div ref={containerRef} className="dv-container relative w-full">
        <div className="p-3 text-error">
          Impossible de charger les données carbone
        </div>
        <svg ref={svgRef} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="dv-container relative w-full">
      <svg ref={svgRef} />
    </div>
  );
};

export default DvCarbonStackedBars;

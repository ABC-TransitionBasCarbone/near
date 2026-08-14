"use client";

import * as d3 from "d3";

const TOOLTIP_CLASS = "dv-tooltip";

export const getD3Tooltip = (
  container: HTMLElement | null,
): d3.Selection<HTMLDivElement, unknown, null, undefined> => {
  const root = d3.select(container ?? document.body);
  const existing = root.select<HTMLDivElement>(`div.${TOOLTIP_CLASS}`);
  const tooltip = existing.empty()
    ? root.append<HTMLDivElement>("div").attr("class", TOOLTIP_CLASS)
    : existing;

  return tooltip
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("background", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("z-index", "9999")
    .style("opacity", 0);
};

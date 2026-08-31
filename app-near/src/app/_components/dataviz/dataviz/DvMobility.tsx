"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { ZoneSelection } from "~/types/enums/zoneSelection";
import {
  buildZoneCellKey,
  type MobilityType,
} from "~/shared/services/dataviz/mobility";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import { getD3Tooltip } from "../hooks/useD3Tooltip";

interface Props {
  selectedSus?: number[];
}

const CIRCLE = {
  center: "circle-center",
  northClose: "circle-up-a",
  northDistant: "circle-up-b",
  eastClose: "circle-right-a",
  eastDistant: "circle-right-b",
  southClose: "circle-down-a",
  southDistant: "circle-down-b",
  westClose: "circle-left-a",
  westDistant: "circle-left-b",
} as const;

type CircleId = (typeof CIRCLE)[keyof typeof CIRCLE];

const DvMobility: React.FC<Props> = ({ selectedSus }) => {
  const {
    containerRef,
    container,
    width: containerWidth,
    height: containerHeight,
  } = useChartDimensions();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const dimensions = useMemo(
    () => ({ width: containerWidth ?? 0, height: containerHeight ?? 0 }),
    [containerWidth, containerHeight],
  );
  const { data: mobilityData } = api.suDataviz.getMobility.useQuery({
    selectedSus,
  });
  const { data: neighborhoodConfig } =
    api.neighborhoodsConfigs.getOne.useQuery();
  const suColors = useSuBank(selectedSus);

  const mobilitySummary = useMemo(() => {
    const zones = mobilityData?.zoneDistribution;
    if (!zones) return null;
    const entries = Object.values(zones);
    if (!entries.length) return null;
    const totalWeight =
      entries.reduce((sum, zone) => sum + zone.respondentCount, 0) || 1;
    const weightedPct = (pick: (z: (typeof entries)[number]) => number) => {
      const weightedSum = entries.reduce(
        (sum, z) => sum + pick(z) * z.respondentCount,
        0,
      );
      return weightedSum / totalWeight;
    };
    return {
      zoneCount: entries.length,
      foot: weightedPct((z) => z.mobilityTypeBreakdown.pct.FOOT),
      bike: weightedPct((z) => z.mobilityTypeBreakdown.pct.BIKE),
      trans: weightedPct((z) => z.mobilityTypeBreakdown.pct.TRANS),
      car: weightedPct((z) => z.mobilityTypeBreakdown.pct.CAR),
    };
  }, [mobilityData]);

  useEffect(() => {
    const { width, height } = dimensions;
    if (!svgRef.current || width === 0 || height === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const tooltip = getD3Tooltip(container);

    const colorMain = suColors?.colorMain ?? "#1565c0";
    const colorLight = suColors?.colorLight4 ?? "#90caf9";

    const cx = width / 2;
    const cy = height / 2;
    const unit = Math.min(width, height);
    const r = unit / 14;
    const posAx = 0.27 * unit;
    const posBx = 0.4 * unit;
    const posABy = 0.075 * unit;

    const ringRadius = posAx + r - r * 0.15;
    const ringG = svg.append("g").attr("id", "20-min-ring");

    ringG
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", ringRadius)
      .attr("fill", "none")
      .attr("stroke", colorMain)
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "6 4");

    const arcR = ringRadius - 12; //offset du texte "20 mins"
    const arcId = "20-min-ring-arc-path";
    ringG
      .append("defs")
      .append("path")
      .attr("id", arcId)
      .attr(
        "d",
        `M ${cx - arcR} ${cy} A ${arcR} ${arcR} 0 1 1 ${cx + arcR} ${cy}`,
      );

    ringG
      .append("text")
      .attr("font-family", "Outfit")
      .attr("font-size", 12)
      .attr("fill", colorMain)
      .attr("letter-spacing", 1)
      .append("textPath")
      .attr("href", `#${arcId}`)
      .attr("startOffset", "73%")
      .attr("text-anchor", "middle")
      .text("~20 mins à pieds");

    const circles: { id: CircleId; x: number; y: number }[] = [
      { id: CIRCLE.center, x: cx, y: cy },
      { id: CIRCLE.northClose, x: cx - posABy, y: cy - posAx },
      { id: CIRCLE.northDistant, x: cx + posABy, y: cy - posBx },
      { id: CIRCLE.southClose, x: cx + posABy, y: cy + posAx },
      { id: CIRCLE.southDistant, x: cx - posABy, y: cy + posBx },
      { id: CIRCLE.westClose, x: cx - posAx, y: cy + posABy },
      { id: CIRCLE.westDistant, x: cx - posBx, y: cy - posABy },
      { id: CIRCLE.eastClose, x: cx + posAx, y: cy - posABy },
      { id: CIRCLE.eastDistant, x: cx + posBx, y: cy + posABy },
    ];

    const n = 15;
    const spacing = n;
    const lineCount = 4;
    const bowRatio = 0.2;

    const modes: { id: string }[] = [
      { id: "foot" },
      { id: "bike" },
      { id: "trans" },
      { id: "car" },
    ];

    const modeIcon: Record<string, string> = {
      foot: "🚶",
      bike: "🚲",
      trans: "🚌",
      car: "🚗",
    };

    const circleToZone: Record<string, string> = {
      [CIRCLE.center]: ZoneSelection.ZONE_QUARTIER,
      [CIRCLE.northClose]: buildZoneCellKey(ZoneSelection.ZONE_A, "A"),
      [CIRCLE.northDistant]: buildZoneCellKey(ZoneSelection.ZONE_A, "B"),
      [CIRCLE.eastClose]: buildZoneCellKey(ZoneSelection.ZONE_B, "A"),
      [CIRCLE.eastDistant]: buildZoneCellKey(ZoneSelection.ZONE_B, "B"),
      [CIRCLE.southClose]: buildZoneCellKey(ZoneSelection.ZONE_C, "A"),
      [CIRCLE.southDistant]: buildZoneCellKey(ZoneSelection.ZONE_C, "B"),
      [CIRCLE.westClose]: buildZoneCellKey(ZoneSelection.ZONE_D, "A"),
      [CIRCLE.westDistant]: buildZoneCellKey(ZoneSelection.ZONE_D, "B"),
    };
    const modeToMtKey: Record<string, MobilityType> = {
      foot: "FOOT",
      bike: "BIKE",
      trans: "TRANS",
      car: "CAR",
    };
    const LINE_STROKE_MIN = 0.5;
    const LINE_STROKE_MAX = 15;
    const getMtPct = (
      zoneKey: string | undefined,
      mtKey: MobilityType,
    ): number | null => {
      if (!zoneKey) return null;
      const cell = mobilityData?.zoneDistribution[zoneKey];
      return cell ? cell.mobilityTypeBreakdown.pct[mtKey] : null;
    };
    const strokeFromPct = (pct: number | null): number =>
      pct != null
        ? LINE_STROKE_MIN + (pct / 100) * (LINE_STROKE_MAX - LINE_STROKE_MIN)
        : 2;
    const fmtPct = (pct: number | null) =>
      pct != null ? `${Math.round(pct)}%` : "–";

    const lineStrokeWidth: Record<string, number> = {};
    const lineLabel: Record<string, string> = {};
    for (const mode of modes) {
      const mtKey = modeToMtKey[mode.id]!;
      const pct = getMtPct(ZoneSelection.ZONE_QUARTIER, mtKey);
      lineStrokeWidth[`circle-center-${mode.id}`] = strokeFromPct(pct);
      lineLabel[`circle-center-${mode.id}`] = fmtPct(pct);
    }
    for (const { id: targetId } of circles.slice(1)) {
      const zoneKey = circleToZone[targetId];
      for (const mode of modes) {
        const mtKey = modeToMtKey[mode.id]!;
        const pct = getMtPct(zoneKey, mtKey);
        lineStrokeWidth[`${mode.id}-to-${targetId}`] = strokeFromPct(pct);
        lineLabel[`${mode.id}-to-${targetId}`] = fmtPct(pct);
      }
    }

    const reversedTextTargets = new Set<CircleId>([
      CIRCLE.southDistant,
      CIRCLE.westClose,
      CIRCLE.westDistant,
      CIRCLE.northClose,
    ]);

    const targetStartOffset: Record<string, string> = {
      [CIRCLE.northClose]: "35%",
      [CIRCLE.northDistant]: "70%",
      [CIRCLE.southClose]: "65%",
      [CIRCLE.southDistant]: "30%",
      [CIRCLE.westClose]: "35%",
      [CIRCLE.westDistant]: "35%",
      [CIRCLE.eastClose]: "65%",
      [CIRCLE.eastDistant]: "70%",
    };

    const center = circles[0]!;
    const linesG = svg.append("g").attr("id", "connection-lines");
    const lineDefs = linesG.append("defs");

    circles.slice(1).forEach(({ id: targetId, x: tx, y: ty }) => {
      const dx = tx - center.x;
      const dy = ty - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / dist;
      const ny = dx / dist;
      const bow = dist * bowRatio;

      for (let i = 0; i < lineCount; i++) {
        const mode = modes[i]!;
        const offset = (i - (lineCount - 1) / 2) * spacing;
        const sx = center.x + offset * nx;
        const sy = center.y + offset * ny;
        const ex = tx + offset * nx;
        const ey = ty + offset * ny;
        const cpx = (sx + ex) / 2 + bow * nx;
        const cpy = (sy + ey) / 2 + bow * ny;

        const lineId = `${mode.id}-to-${targetId}`;
        const pathDefId = `path-def-${lineId}`;

        const reversed = reversedTextTargets.has(targetId);
        lineDefs
          .append("path")
          .attr("id", pathDefId)
          .attr(
            "d",
            reversed
              ? `M ${ex},${ey} Q ${cpx},${cpy} ${sx},${sy}`
              : `M ${sx},${sy} Q ${cpx},${cpy} ${ex},${ey}`,
          );

        linesG
          .append("path")
          .attr("id", lineId)
          .attr("d", `M ${sx},${sy} Q ${cpx},${cpy} ${ex},${ey}`)
          .attr("fill", "none")
          .attr("stroke", colorLight)
          .attr("stroke-width", lineStrokeWidth[lineId] ?? 2)
          .attr("opacity", 0.7);

        linesG
          .append("text")
          .attr("font-size", 12)
          .attr("font-family", "Outfit")
          .attr("fill", colorMain)
          .attr("dy", "4")
          .append("textPath")
          .attr("href", `#${pathDefId}`)
          .attr("startOffset", targetStartOffset[targetId] ?? "50%")
          .attr("text-anchor", "middle")
          .text(`${modeIcon[mode.id] ?? ""} ${lineLabel[lineId] ?? ""}`);
      }
    });

    const USAGE_ICON_SIZE_MIN = 10;
    const USAGE_ICON_SIZE_MAX = 25;
    const usageTriangleR = r * 0.45;
    const usages: { id: string; icon: string; label: string; angle: number }[] =
      [
        { id: "hobby", icon: "🏸", label: "Loisirs", angle: -Math.PI / 2 },
        {
          id: "work",
          icon: "💼",
          label: "Travail",
          angle: -Math.PI / 2 + (2 * Math.PI) / 3,
        },
        {
          id: "food",
          icon: "🥕",
          label: "Alimentation",
          angle: -Math.PI / 2 + (4 * Math.PI) / 3,
        },
      ];
    const usageToPctKey: Record<string, "work" | "hobby" | "buyFood"> = {
      work: "work",
      hobby: "hobby",
      food: "buyFood",
    };

    const usageIconSize: Record<string, number> = {};
    const usagePct: Record<string, number | null> = {};
    for (const { id: circleId } of circles) {
      const zoneKey = circleToZone[circleId];
      const cell = zoneKey
        ? mobilityData?.zoneDistribution[zoneKey]
        : undefined;
      for (const usage of usages) {
        const pctKey = usageToPctKey[usage.id];
        const pct = cell && pctKey ? cell.pct[pctKey] : null;
        usagePct[`${circleId}-${usage.id}`] = pct;
        usageIconSize[`${circleId}-${usage.id}`] =
          pct != null
            ? USAGE_ICON_SIZE_MIN +
              (pct / 100) * (USAGE_ICON_SIZE_MAX - USAGE_ICON_SIZE_MIN)
            : 14;
      }
    }

    const FONT_WEIGHT_MIN = 200;
    const FONT_WEIGHT_MAX = 2000;
    const CIRCLE_STROKE_MIN = 1;
    const CIRCLE_STROKE_MAX = 30;
    const CIRCLE_RADIUS_FACTOR_MIN = 0.85;
    const CIRCLE_RADIUS_FACTOR_MAX = 1.15;
    const fontWeightForCircle: Record<string, number> = {};
    const strokeForCircle: Record<string, number> = {};
    const radiusForCircle: Record<string, number> = {};
    for (const { id } of circles) {
      const zoneKey = circleToZone[id];
      const pct = zoneKey
        ? (mobilityData?.zoneDistribution[zoneKey]?.pctOfTotal ?? null)
        : null;
      fontWeightForCircle[id] =
        pct != null
          ? Math.round(
              FONT_WEIGHT_MIN +
                (pct / 100) * (FONT_WEIGHT_MAX - FONT_WEIGHT_MIN),
            )
          : 400;
      strokeForCircle[id] =
        pct != null
          ? CIRCLE_STROKE_MIN +
            (pct / 100) * (CIRCLE_STROKE_MAX - CIRCLE_STROKE_MIN)
          : 2;
      radiusForCircle[id] =
        pct != null
          ? r *
            (CIRCLE_RADIUS_FACTOR_MIN +
              (pct / 100) *
                (CIRCLE_RADIUS_FACTOR_MAX - CIRCLE_RADIUS_FACTOR_MIN))
          : r;
    }

    svg
      .append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("r", r + 4 * spacing)
      .attr("fill", "white")
      .attr("stroke", "none");

    circles.forEach(({ id, x, y }) => {
      const g = svg.append("g").attr("id", id);

      g.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", radiusForCircle[id] ?? r)
        .attr("fill", "white")
        .attr("stroke", colorMain)
        .attr("stroke-width", strokeForCircle[id] ?? 2);

      if (id === CIRCLE.center) {
        g.append("text")
          .attr("x", x)
          .attr("y", y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-family", "Outfit")
          .attr("font-size", 12)
          .attr("fill", colorMain)
          .attr("pointer-events", "none")
          .text("Quartier");
      }

      usages.forEach((usage) => {
        const ux = x + usageTriangleR * Math.cos(usage.angle);
        const uy = y + usageTriangleR * Math.sin(usage.angle);
        const sz = Math.min(
          USAGE_ICON_SIZE_MAX,
          Math.max(
            USAGE_ICON_SIZE_MIN,
            usageIconSize[`${id}-${usage.id}`] ?? usageIconSize[usage.id] ?? 14,
          ),
        );
        const pct = usagePct[`${id}-${usage.id}`] ?? null;
        g.append("text")
          .attr("id", `usage-${id}-${usage.id}`)
          .attr("x", ux)
          .attr("y", uy)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .attr("font-size", sz)
          .style("cursor", "pointer")
          .text(usage.icon)
          .on("mousemove", function (event: MouseEvent) {
            const rect = container?.getBoundingClientRect();
            const px = rect
              ? event.pageX - (rect.left + window.scrollX)
              : event.pageX;
            const py = rect
              ? event.pageY - (rect.top + window.scrollY)
              : event.pageY;
            tooltip
              .style("left", `${px + 10}px`)
              .style("top", `${py - 24}px`)
              .style("opacity", 1)
              .text(
                `${usage.label} : ${pct != null ? `${pct.toFixed(1)}%` : "–"}`,
              );
          })
          .on("mouseout", () => tooltip.style("opacity", 0));
      });
    });

    const destLabelLines: Record<string, [string, string]> = {
      [CIRCLE.northClose]: ["Vers zone", "Nord proche"],
      [CIRCLE.northDistant]: ["Vers zone", "Nord éloignée"],
      [CIRCLE.southClose]: ["Vers zone", "Sud proche"],
      [CIRCLE.southDistant]: ["Vers zone", "Sud éloignée"],
      [CIRCLE.westClose]: ["Vers zone", "Ouest proche"],
      [CIRCLE.westDistant]: ["Vers zone", "Ouest éloignée"],
      [CIRCLE.eastClose]: ["Vers zone", "Est proche"],
      [CIRCLE.eastDistant]: ["Vers zone", "Est éloignée"],
    };

    const destConfigKey: Record<
      string,
      keyof NonNullable<typeof neighborhoodConfig>
    > = {
      [CIRCLE.northClose]: "northCloseLocations",
      [CIRCLE.northDistant]: "northDistantLocations",
      [CIRCLE.southClose]: "southCloseLocations",
      [CIRCLE.southDistant]: "southDistantLocations",
      [CIRCLE.westClose]: "westCloseLocations",
      [CIRCLE.westDistant]: "westDistantLocations",
      [CIRCLE.eastClose]: "eastCloseLocations",
      [CIRCLE.eastDistant]: "eastDistantLocations",
    };

    const destLabelOffset: Record<
      string,
      { dx: number; dy: number; anchor: string }
    > = {
      [CIRCLE.northClose]: { dx: -r - 4, dy: 0, anchor: "end" },
      [CIRCLE.northDistant]: { dx: r + 4, dy: 0, anchor: "start" },
      [CIRCLE.southClose]: { dx: r + 4, dy: 0, anchor: "start" },
      [CIRCLE.southDistant]: { dx: -r - 4, dy: 0, anchor: "end" },
      [CIRCLE.westClose]: { dx: -r - 4, dy: 0, anchor: "end" },
      [CIRCLE.westDistant]: { dx: -r - 4, dy: 0, anchor: "end" },
      [CIRCLE.eastClose]: { dx: r + 4, dy: 0, anchor: "start" },
      [CIRCLE.eastDistant]: { dx: r + 4, dy: 0, anchor: "start" },
    };

    circles.slice(1).forEach(({ id, x, y }) => {
      const cfg = destLabelOffset[id];
      if (!cfg) return;

      const configKey = destConfigKey[id];
      const configValue = configKey ? neighborhoodConfig?.[configKey] : null;
      const configText =
        typeof configValue === "string" && configValue.trim().length > 0
          ? configValue.trim()
          : null;

      const lines = destLabelLines[id] ?? [id, ""];
      const fullLabel = lines.join(" ").trim();

      const label = svg
        .append("text")
        .attr("id", `dest-${id}`)
        .attr("x", x + cfg.dx)
        .attr("y", y + cfg.dy)
        .attr("text-anchor", cfg.anchor)
        .attr("dominant-baseline", "central")
        .attr("font-family", "Outfit")
        .attr("font-size", 12)
        .attr("font-weight", fontWeightForCircle[id] ?? 400)
        .attr("fill", colorMain)
        .attr("pointer-events", configText ? "auto" : "none");

      label
        .append("tspan")
        .attr("x", x + cfg.dx)
        .attr("dy", "-0.5em")
        .text(lines[0]);
      label
        .append("tspan")
        .attr("x", x + cfg.dx)
        .attr("dy", "1.1em")
        .text(lines[1]);

      if (!configText) return;

      label
        .style("cursor", "pointer")
        .on("mousemove", function (event: MouseEvent) {
          const rect = container?.getBoundingClientRect();
          const px = rect
            ? event.pageX - (rect.left + window.scrollX)
            : event.pageX;
          const py = rect
            ? event.pageY - (rect.top + window.scrollY)
            : event.pageY;
          tooltip
            .style("left", `${px + 10}px`)
            .style("top", `${py - 24}px`)
            .style("max-width", "260px")
            .style("white-space", "normal")
            .style("opacity", 1)
            .text(`${fullLabel} : ${configText}`);
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    });

    const satSpacing = spacing;
    const satelliteCircles: { id: string; mode: string; index: number }[] = [
      { id: "circle-center-foot", mode: "foot", index: 1 },
      { id: "circle-center-bike", mode: "bike", index: 2 },
      { id: "circle-center-trans", mode: "trans", index: 3 },
      { id: "circle-center-car", mode: "car", index: 4 },
    ];

    satelliteCircles.forEach(({ id: satId, mode: satMode, index }) => {
      const satR = r + index * satSpacing;

      const satG = svg.append("g").attr("id", satId);

      satG
        .append("circle")
        .attr("cx", cx)
        .attr("cy", cy)
        .attr("r", satR)
        .attr("fill", "none")
        .attr("stroke", colorLight)
        .attr("stroke-width", lineStrokeWidth[satId] ?? 2);

      const satArcId = `arc-def-${satId}`;
      const satArcOffset = satR;
      satG
        .append("defs")
        .append("path")
        .attr("id", satArcId)
        .attr(
          "d",
          `M ${cx - satArcOffset} ${cy} A ${satArcOffset} ${satArcOffset} 0 1 1 ${cx + satArcOffset} ${cy}`,
        );

      satG
        .append("text")
        .attr("font-size", 12)
        .attr("font-family", "Outfit")
        .attr("fill", colorMain)
        .attr("dy", "3")
        .append("textPath")
        .attr("href", `#${satArcId}`)
        .attr("startOffset", "76%")
        .attr("text-anchor", "right")
        .text(`${modeIcon[satMode] ?? ""} ${lineLabel[satId] ?? ""}`)
        .append("tspan")
        .attr("background-color", "white")
        .attr("padding", "0.1em 0.2em");
    });
  }, [dimensions, mobilityData, neighborhoodConfig, suColors, container]);

  return (
    <div className="flex h-full w-full flex-col">
      <div ref={containerRef} className="relative min-h-0 flex-1">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
          aria-hidden="true"
        />
        {mobilitySummary && (
          <p className="sr-only">
            Diagramme de mobilité : répartition des modes de déplacement entre
            le quartier et {mobilitySummary.zoneCount} zones environnantes, dans
            un rayon d&apos;environ 20 minutes à pied. Répartition moyenne des
            modes — Marche : {mobilitySummary.foot.toFixed(0)}%, Vélo :{" "}
            {mobilitySummary.bike.toFixed(0)}%, Transports en commun :{" "}
            {mobilitySummary.trans.toFixed(0)}%, Voiture :{" "}
            {mobilitySummary.car.toFixed(0)}%.
          </p>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-grayLight pt-2 text-xs text-gray">
        <span className="flex items-center gap-1">
          <span aria-hidden="true">🏸</span> Loisirs
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden="true">💼</span> Travail
        </span>
        <span className="flex items-center gap-1">
          <span aria-hidden="true">🥕</span> Alimentation
        </span>
        <span>
          — la taille de l&apos;icône reflète la part de ce motif pour la zone ;
          la taille du cercle reflète la part totale des déplacements vers la
          zone.
        </span>
      </div>
    </div>
  );
};

export default DvMobility;

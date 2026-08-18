"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import {
  sankey,
  sankeyLeft,
  sankeyLinkHorizontal,
  type SankeyGraph,
  type SankeyLink,
  type SankeyNode,
} from "d3-sankey";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import { getD3Tooltip } from "../hooks/useD3Tooltip";

type NodeData = { id: string; name: string; emoji: string; value: number };
type LinkData = { value: number; [k: string]: unknown };
type D3Node = SankeyNode<NodeData, LinkData>;
type D3Link = SankeyLink<NodeData, LinkData>;

interface Props {
  selectedSus?: number[];
}

const CATEGORY_GAP = 22;
const CATEGORY_NODE_PADDING = 10;
const CATEGORY_LEAF_ROW_HEIGHT = 22;
const CATEGORY_MIN_HEIGHT = 50;

type CategoryLayout = {
  graph: SankeyGraph<NodeData, LinkData>;
  offsetY: number;
  bandHeight: number;
};

const DvCarbonSankey: React.FC<Props> = ({ selectedSus }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const {
    containerRef,
    container,
    width: measuredWidth,
    height: measuredHeight,
  } = useChartDimensions();

  const {
    colorMain: mainColor,
    colorLight1,
    colorDark1,
  } = useSuBank(selectedSus);

  const width = measuredWidth && Math.max(200, measuredWidth);
  const height = measuredHeight && Math.max(220, measuredHeight);

  const {
    data: payload,
    isLoading: loading,
    error,
  } = api.suDataviz.getCarbonSankey.useQuery({ selectedSus });

  const graph = useMemo(() => {
    if (!payload?.sankeyData || payload.sankeyData.nodes.length === 0)
      return null;
    const w = width ?? 300;
    const h = height ?? 260;

    const sideMargin = 16;
    const topSpace = 30;
    const bottomSpace = 40;
    const labelSpaceLeft = 140;
    const labelSpaceRight = 160;
    const chartWidth = Math.max(
      100,
      w - (sideMargin * 2 + labelSpaceLeft + labelSpaceRight),
    );
    const chartHeight = Math.max(80, h - topSpace - bottomSpace);

    const filteredNodes = payload.sankeyData.nodes.filter((n) => n.value > 0);
    const idxMap = new Map<number, number>();
    filteredNodes.forEach((n, i) => {
      const originalIndex = payload.sankeyData.nodes.findIndex(
        (nn) => nn.id === n.id,
      );
      if (originalIndex >= 0) idxMap.set(originalIndex, i);
    });
    const filteredLinks = payload.sankeyData.links
      .filter((l) => idxMap.has(l.source) && idxMap.has(l.target))
      .map((l) => ({
        ...l,
        source: idxMap.get(l.source) ?? 0,
        target: idxMap.get(l.target) ?? 0,
      }));

    const targetIdxs = new Set(filteredLinks.map((l) => l.target));
    const rootIdxs = filteredNodes
      .map((_, i) => i)
      .filter((i) => !targetIdxs.has(i));
    const outgoingByIdx = new Map<number, typeof filteredLinks>();
    filteredLinks.forEach((l) => {
      const arr = outgoingByIdx.get(l.source) ?? [];
      arr.push(l);
      outgoingByIdx.set(l.source, arr);
    });

    const categories = rootIdxs.map((rootIdx) => {
      const localIdxOf = new Map<number, number>();
      const nodes: NodeData[] = [];
      const links: { source: number; target: number; value: number }[] = [];
      let leafCount = 0;

      const visit = (idx: number) => {
        localIdxOf.set(idx, nodes.length);
        nodes.push({ ...filteredNodes[idx]! });
        const outgoing = outgoingByIdx.get(idx) ?? [];
        if (outgoing.length === 0) leafCount += 1;
        for (const l of outgoing) {
          visit(l.target);
          links.push({
            source: localIdxOf.get(idx)!,
            target: localIdxOf.get(l.target)!,
            value: l.value,
          });
        }
      };
      visit(rootIdx);

      return {
        rootValue: filteredNodes[rootIdx]!.value,
        nodes,
        links,
        leafCount: Math.max(1, leafCount),
      };
    });

    if (categories.length === 0) return null;

    const totalValue = categories.reduce((sum, c) => sum + c.rootValue, 0) || 1;
    const gap = categories.length > 1 ? CATEGORY_GAP : 0;
    const available = Math.max(40, chartHeight - gap * (categories.length - 1));
    const rawFloors = categories.map((c) =>
      Math.max(CATEGORY_MIN_HEIGHT, c.leafCount * CATEGORY_LEAF_ROW_HEIGHT),
    );
    const sumFloors = rawFloors.reduce((a, b) => a + b, 0);
    const floorScale = sumFloors > available ? available / sumFloors : 1;
    const floors = rawFloors.map((f) => f * floorScale);
    const remaining = Math.max(
      0,
      available - floors.reduce((a, b) => a + b, 0),
    );

    try {
      let cursorY = 0;
      const laidOutCategories: CategoryLayout[] = categories.map((cat, i) => {
        const weight = cat.rootValue / totalValue;
        const bandHeight = floors[i]! + remaining * weight;

        const s = sankey<NodeData, LinkData>()
          .nodeWidth(14)
          .nodePadding(CATEGORY_NODE_PADDING)
          .nodeAlign(sankeyLeft)
          .nodeSort(() => 0)
          .extent([
            [0, 0],
            [chartWidth, bandHeight],
          ]);

        const laidOut = s({
          nodes: cat.nodes,
          links: cat.links,
        });

        const offsetY = cursorY;
        cursorY += bandHeight + gap;

        return { graph: laidOut, offsetY, bandHeight };
      });

      return {
        categories: laidOutCategories,
        dims: {
          sideMargin,
          topSpace,
          bottomSpace,
          chartWidth,
          chartHeight,
          labelSpaceLeft,
          labelSpaceRight,
          w,
          h,
        },
      };
    } catch (e) {
      console.error("[DvCarbonSankey] sankey layout error:", e);
      return null;
    }
  }, [payload, width, height]);

  const categorySummaries = useMemo(() => {
    if (!payload) return [];
    const { nodes, links } = payload.sankeyData;
    const targetSet = new Set(links.map((l) => l.target));
    return nodes
      .filter((n, idx) => !targetSet.has(idx) && n.value > 0)
      .map((n) => ({ id: n.id, name: n.name, value: n.value }))
      .sort((a, b) => b.value - a.value);
  }, [payload]);

  // Render
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (!graph?.categories?.length || !payload) {
      return;
    }

    const { categories, dims } = graph;
    const { sideMargin, topSpace, labelSpaceLeft, w, h } = dims;

    svg.attr("width", w).attr("height", h);

    const root = svg
      .append("g")
      .attr(
        "transform",
        `translate(${sideMargin + labelSpaceLeft}, ${topSpace})`,
      );

    const tooltip = getD3Tooltip(container);

    const nx0 = (n: D3Node) => n.x0 ?? 0;
    const nx1 = (n: D3Node) => n.x1 ?? 0;
    const ny0 = (n: D3Node) => n.y0 ?? 0;
    const ny1 = (n: D3Node) => n.y1 ?? 0;
    const nodeX = (n: D3Node) => nx0(n);
    const nodeY = (n: D3Node) => ny0(n);
    const nodeW = (n: D3Node) => Math.max(1, nx1(n) - nx0(n));
    const nodeH = (n: D3Node) => Math.max(1, ny1(n) - ny0(n));

    const linkPath = sankeyLinkHorizontal<NodeData, LinkData>();

    const nodeFillColor = d3.color(mainColor) ?? d3.color("#2b6cb0")!;
    const linkColor = d3.color(colorLight1) ?? d3.color(mainColor)!;

    const showTooltip = (event: MouseEvent, text: string) => {
      const rect = container?.getBoundingClientRect();
      const px = rect
        ? event.pageX - (rect.left + window.scrollX)
        : event.pageX;
      const py = rect ? event.pageY - (rect.top + window.scrollY) : event.pageY;
      tooltip
        .style("left", `${px + 12}px`)
        .style("top", `${py + 12}px`)
        .style("opacity", 1)
        .text(text);
    };
    const nodeTooltipText = (d: D3Node) =>
      `${d.emoji ?? ""} ${d.name ?? d.id} : ${((d.value ?? 0) / 1000).toFixed(2)} t CO2e`;

    categories.forEach(({ graph: g, offsetY }) => {
      const catGroup = root
        .append("g")
        .attr("transform", `translate(0, ${offsetY})`);

      const nodes = g.nodes as D3Node[];
      const links = g.links as D3Link[];
      const leftNodes = nodes.filter((n) => (n.targetLinks?.length ?? 0) === 0);
      const rightNodes = nodes.filter(
        (n) => (n.sourceLinks?.length ?? 0) === 0,
      );

      catGroup
        .append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", 0.35)
        .selectAll("path")
        .data(links)
        .enter()
        .append("path")
        .attr("d", (d: D3Link) => linkPath(d)!)
        .attr("stroke", linkColor.formatHex())
        .attr("stroke-width", (d: D3Link & { width?: number }) =>
          Math.max(1, d.width ?? 1),
        )
        .attr("opacity", 0.6)
        .style("cursor", "pointer")
        .on("mousemove", function (event: MouseEvent, d: D3Link) {
          d3.select(this).attr("opacity", 0.9);
          const s = d.source as D3Node;
          const t = d.target as D3Node;
          showTooltip(
            event,
            `${s.emoji ?? ""} ${s.name ?? s.id} → ${t.emoji ?? ""} ${t.name ?? t.id} : ${((d.value ?? 0) / 1000).toFixed(2)} t CO2e`,
          );
        })
        .on("mouseout", function () {
          d3.select(this).attr("opacity", 0.6);
          tooltip.style("opacity", 0);
        });

      const nodeGroup = catGroup.append("g").attr("class", "nodes");
      nodeGroup
        .selectAll("rect.node")
        .data(nodes)
        .enter()
        .append("rect")
        .attr("class", "node")
        .attr("x", (d) => nodeX(d))
        .attr("y", (d) => nodeY(d))
        .attr("width", (d) => nodeW(d))
        .attr("height", (d) => nodeH(d))
        .attr("fill", () => nodeFillColor.formatHex())
        .attr("stroke", colorDark1)
        .attr("stroke-width", 0.4)
        .attr("rx", 3)
        .attr("ry", 3)
        .style("cursor", "pointer")
        .on("mousemove", function (event: MouseEvent, d: D3Node) {
          showTooltip(event, nodeTooltipText(d));
        })
        .on("mouseout", function () {
          tooltip.style("opacity", 0);
        });

      const labelText = (
        sel: d3.Selection<SVGTextElement, D3Node, SVGGElement, unknown>,
      ) =>
        sel
          .style("font-size", "12px")
          .style("fill", mainColor)
          .style("cursor", "pointer")
          .on("mousemove", function (event: MouseEvent, d: D3Node) {
            showTooltip(event, nodeTooltipText(d));
          })
          .on("mouseout", function () {
            tooltip.style("opacity", 0);
          })
          .text((d: D3Node) => `${d.emoji ?? ""} ${d.name ?? d.id}`);

      labelText(
        nodeGroup
          .selectAll<SVGTextElement, D3Node>("text.left-label")
          .data(leftNodes)
          .enter()
          .append("text")
          .attr("class", "left-label")
          .attr("x", (d) => nodeX(d) - 8)
          .attr("y", (d) => nodeY(d) + nodeH(d) / 2)
          .attr("text-anchor", "end")
          .attr("dominant-baseline", "middle"),
      );

      labelText(
        nodeGroup
          .selectAll<SVGTextElement, D3Node>("text.right-label")
          .data(rightNodes)
          .enter()
          .append("text")
          .attr("class", "right-label")
          .attr("x", (d) => nodeX(d) + nodeW(d) + 8)
          .attr("y", (d) => nodeY(d) + nodeH(d) / 2)
          .attr("text-anchor", "start")
          .attr("dominant-baseline", "middle"),
      );
    });

    const totalTons = (payload.totalValue / 1000).toFixed(1);
    svg
      .append("text")
      .attr("x", 12)
      .attr("y", 16)
      .style("font-size", "14px")
      .style("font-weight", "600")
      .style("fill", mainColor)
      .text(`☁ Empreinte individuelle moyenne : ${totalTons} t CO2e / an`);
  }, [graph, payload, mainColor, colorLight1, colorDark1, container]);

  if (loading) {
    return (
      <div ref={containerRef} className="dv-container h-full w-full">
        <div className="p-3 text-gray">Chargement du Sankey…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className="dv-container h-full w-full">
        <div className="p-3 text-error">
          Impossible de charger les données du Sankey carbone
        </div>
      </div>
    );
  }

  if (!payload || payload.sankeyData.nodes.length === 0) {
    return (
      <div ref={containerRef} className="dv-container h-full w-full">
        <div className="p-3 text-gray">Aucune donnée carbone disponible.</div>
      </div>
    );
  }

  const totalTons = (payload.totalValue / 1000).toFixed(1);

  return (
    <div ref={containerRef} className="dv-container relative h-full w-full">
      <svg ref={svgRef} aria-hidden="true" />
      <div className="sr-only">
        <p>
          Empreinte individuelle moyenne : {totalTons} t CO2e par an, répartie
          en {categorySummaries.length} catégories.
        </p>
        <ul>
          {categorySummaries.map((c) => (
            <li key={c.id}>
              {c.name} : {(c.value / 1000).toFixed(2)} t CO2e
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DvCarbonSankey;

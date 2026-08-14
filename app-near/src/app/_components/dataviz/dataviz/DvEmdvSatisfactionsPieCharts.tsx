"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { api } from "~/trpc/react";
import { getD3Tooltip } from "../hooks/useD3Tooltip";
import type { SatisfactionQuestionResult } from "~/server/su/dataviz/satisfactionDistribution";

type Props = { selectedSus?: number[] };

const CARD_SIZE = 150;
const MARGIN = 10;

type SliceDatum = { key: string; color: string; pct: number };

// Count visible grapheme clusters to size the emoji correctly in the donut hole
const getEmojiCount = (str: string): number => {
  try {
    return [...new Intl.Segmenter().segment(str)].length;
  } catch {
    return [...str.replace(/[️‍]/g, "")].length;
  }
};

const EmdvPieCard: React.FC<{ question: SatisfactionQuestionResult }> = ({
  question,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = svgRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    const radius = CARD_SIZE / 2 - MARGIN;
    const innerRadius = radius * 0.38;

    const svg = d3.select(el);
    svg.selectAll("*").remove();
    svg.attr("width", CARD_SIZE).attr("height", CARD_SIZE);

    const g = svg
      .append("g")
      .attr("transform", `translate(${CARD_SIZE / 2}, ${CARD_SIZE / 2})`);

    const sliceDefs: SliceDatum[] = [
      {
        key: "NO",
        color: "#ffcdd2",
        pct: question.responses.find((r) => r.choice === "NO")?.percentage ?? 0,
      },
      {
        key: "DONT_KNOW",
        color: "#e0e0e0",
        pct:
          question.responses.find((r) => r.choice === "DONT_KNOW")
            ?.percentage ?? 0,
      },
      {
        key: "YES",
        color: "#c8e6c9",
        pct:
          question.responses.find((r) => r.choice === "YES")?.percentage ?? 0,
      },
    ];

    const pie = d3
      .pie<SliceDatum>()
      .value((d) => d.pct)
      .sort(null);

    const arc = d3
      .arc<d3.PieArcDatum<SliceDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const arcs = pie(sliceDefs);

    const tooltip = getD3Tooltip(container).style("white-space", "nowrap");

    g.selectAll<SVGPathElement, d3.PieArcDatum<SliceDatum>>(".slice")
      .data(arcs)
      .enter()
      .append("path")
      .attr("class", "slice")
      .attr("d", arc)
      .attr("fill", (d) => d.data.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .style("cursor", "pointer")
      .on("mousemove", function (event: MouseEvent, d) {
        const rect = container.getBoundingClientRect();
        const px = event.pageX - (rect.left + window.scrollX);
        const py = event.pageY - (rect.top + window.scrollY);
        const label =
          d.data.key === "YES"
            ? "Oui"
            : d.data.key === "NO"
              ? "Non"
              : "Pas d'avis";
        tooltip
          .style("left", `${px + 10}px`)
          .style("top", `${py - 28}px`)
          .style("opacity", 1)
          .text(`${label} : ${d.data.pct.toFixed(1)}%`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
      });

    arcs.forEach((d) => {
      if (d.data.pct >= 5) {
        const centroid = arc.centroid(d);
        g.append("text")
          .attr("x", centroid[0])
          .attr("y", centroid[1])
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "central")
          .style("font-size", "10px")
          .style("font-weight", "600")
          .style("fill", "#333")
          .style("pointer-events", "none")
          .text(`${d.data.pct.toFixed(0)}%`);
      }
    });

    const emojiCount = getEmojiCount(question.emoji);
    const emojiFontSize =
      emojiCount >= 3
        ? Math.floor(innerRadius * 0.56)
        : emojiCount === 2
          ? Math.floor(innerRadius * 0.76)
          : Math.floor(innerRadius * 1.15);
    g.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .style("font-size", `${emojiFontSize}px`)
      .style("pointer-events", "none")
      .text(question.emoji);
  }, [question]);

  return (
    <div
      ref={containerRef}
      className="dv-container relative flex flex-col items-center gap-1 px-2 pb-1.5 pt-2"
      style={{ width: CARD_SIZE + 32 }}
    >
      <svg ref={svgRef} />
      <div
        className="px-1 text-center text-[11px] leading-tight text-black"
        style={{ maxWidth: CARD_SIZE + 12 }}
      >
        {question.title}
      </div>
    </div>
  );
};

const DvEmdvSatisfactionsPieCharts: React.FC<Props> = ({ selectedSus }) => {
  const {
    data,
    isLoading: loading,
    error,
  } = api.suDataviz.getSatisfactionDistribution.useQuery({ selectedSus });
  const subcategories = data?.subcategories ?? [];

  if (loading) return <div className="p-3 text-gray">Chargement…</div>;
  if (error)
    return (
      <div className="p-3 text-error">Impossible de charger les données</div>
    );
  if (!subcategories.length)
    return <div className="p-3 text-gray">Aucune donnée.</div>;

  return (
    <div className="px-2 pb-6 pt-2">
      {subcategories.map((sc) => (
        <div key={sc.subcategory} className="zone-target mb-8">
          <h3 className="mx-1 mb-3 border-b border-grayLight pb-1.5 text-sm font-semibold text-black">
            {sc.emoji} {sc.label}
          </h3>
          <div className="flex flex-wrap justify-center gap-5 pl-1">
            {sc.questions.map((q) => (
              <EmdvPieCard key={q.field} question={q} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DvEmdvSatisfactionsPieCharts;

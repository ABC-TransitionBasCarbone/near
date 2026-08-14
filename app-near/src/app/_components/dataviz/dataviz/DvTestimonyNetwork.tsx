"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import type { ZoomTransform } from "d3";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import type {
  TestimonyNode,
  TestimonyLink,
} from "~/server/su/dataviz/testimonyNetwork";

// D3 event interfaces for better type safety
interface D3ZoomEvent {
  transform: ZoomTransform;
}

// (drag event typing handled via d3.D3DragEvent in callbacks to avoid TS friction)

// Types
// -----
type NodeDatum = TestimonyNode & {
  // Additional D3 properties for positioning
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
};

type LinkDatum = TestimonyLink;

// Modal component
// ---------------
type ModalProps = {
  open: boolean;
  onClose: () => void;
  node: NodeDatum | null;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, node }) => {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Card sizing
  const cardWidth = 384; // ~w-96
  const cardHeight = 560;
  const illustrationHeight = Math.round(cardHeight / 3);

  const neighborhoodBank = useSuBank();
  const { data: allSus } = api.suDataviz.getSuInfo.useQuery();
  const suBank = useMemo(
    () =>
      node?.su != null
        ? allSus?.find((s) => s.su === node.su)?.bankData
        : undefined,
    [allSus, node?.su],
  );

  const bgColor =
    node?.type === "parent"
      ? neighborhoodBank.colorLight2
      : (suBank?.colorLight2 ?? "#f3f4f6");
  const suName = suBank?.name ?? "";

  // Labels nodes catégories
  const SUBCATEGORY_LABELS: Record<string, string> = {
    Food: "Alimentation",
    Housing: "Logement",
    Politics: "Participation citoyenne",
    Solidarity: "Solidarité",
    NghLife: "Vie de quartier",
    Parks: "Parcs et espaces verts",
    Shopping: "Réparation / Shopping",
    Services: "Services",
    Mobility: "Mobilité",
    General: "Général",
  };

  const labelForSubcategory = (code?: string): string => {
    if (!code) return "Catégorie";
    return SUBCATEGORY_LABELS[code] ?? code;
  };

  const formatGenderLabel = (value?: string): string => {
    if (!value) return "—";
    const v = String(value).toLowerCase();
    if (["male", "homme", "m", "masculin", "man"].includes(v)) return "Homme";
    if (["female", "femme", "f", "féminin", "feminin", "woman"].includes(v))
      return "Femme";
    if (["other", "autre", "non-binaire", "non binaire"].includes(v))
      return "Autre";
    return value;
  };

  const formatAgeLabel = (value?: string): string => {
    if (!value) return "—";
    const map: Record<string, string> = {
      FROM_15_TO_29: "15–29 ans",
      FROM_30_TO_44: "30–44 ans",
      FROM_45_TO_59: "45–59 ans",
      FROM_60_TO_74: "60–74 ans",
      ABOVE_75: "75 ans et +",
    };
    return map[value] ?? value;
  };

  if (!open || !node) return null;

  const isParent = node.type === "parent";
  const isChild = node.type === "child";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative z-10 rounded-2xl border border-black/5 shadow-2xl backdrop-blur-sm"
        style={{
          width: cardWidth,
          height: cardHeight,
          backgroundColor: bgColor,
        }}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2 text-sm text-white">
            {isParent && <span className="text-xl">{node.emoji}</span>}
            <span className="max-w-[260px] truncate font-semibold">
              {isParent
                ? labelForSubcategory(node.subcategory)
                : node.questionShort && node.questionShort.trim().length > 0
                  ? node.questionShort
                  : labelForSubcategory(node.group)}
            </span>
          </div>
          <button
            className="text-xl leading-none text-gray hover:text-black"
            onClick={onClose}
            aria-label="Fermer"
            title="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Illustration placeholder*/}
        <div
          className="mx-5 mt-4 flex items-center justify-center rounded-lg border border-dashed border-white bg-grayExtraLight text-xs text-gray"
          style={{ height: illustrationHeight }}
        >
          Illustration
        </div>

        {/* Main */}
        <div className="h-[calc(100%-theme(spacing.12)-theme(spacing.4)-theme(spacing.5)-theme(spacing.5))] overflow-y-auto px-5 pb-5 pt-4">
          {/* Testimony */}
          {isChild && node.testimony && (
            <div className="mb-4">
              <div className="mb-1 text-xs tracking-wide text-white">
                {formatGenderLabel(node.respondentGender)},{" "}
                {formatAgeLabel(node.respondentAge)}, S.U. n°{node.su ?? "?"}{" "}
                &quot;{suName}&quot; :
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="italic leading-relaxed text-gray">
                  &ldquo;{node.testimony}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Parent info si témoignage */}
          {isParent && (
            <div className="mb-4">
              <div className="mb-1 text-xs uppercase tracking-wide text-gray">
                Thème
              </div>
              <div className="flex items-center gap-3 rounded-lg border bg-grayExtraLight p-4">
                <span className="text-2xl">{node.emoji}</span>
                <div className="font-semibold">{node.subcategory}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// D3 Force-Directed Graph Component
// ---------------------------------
interface DvTestimonyNetworkProps {
  selectedSus?: number[]; //
}

const DvTestimonyNetwork: React.FC<DvTestimonyNetworkProps> = ({
  selectedSus,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const { containerRef: svgContainer, width, height } = useChartDimensions();
  const [nodes, setNodes] = useState<NodeDatum[]>([]);
  const [links, setLinks] = useState<LinkDatum[]>([]);
  const [selectedNode, setSelectedNode] = useState<NodeDatum | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: networkData,
    isLoading: loading,
    refetch,
  } = api.suDataviz.getTestimonyNetwork.useQuery({ selectedSus });

  // colors
  const {
    colorMain: mainColor,
    colorLight1,
    colorLight3,
  } = useSuBank(selectedSus);
  const { colorMain: quartierMainColor } = useSuBank();

  // Consistance couleurs par Su pour les Nodes dans la vue quartier
  const { data: allSus } = api.suDataviz.getSuInfo.useQuery();
  const suColorMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (!networkData?.isNeighborhood || !allSus) return map;
    nodes
      .filter((n) => n.type === "child" && typeof n.su === "number")
      .forEach((n) => {
        const color = allSus.find((s) => s.su === n.su)?.bankData?.colorMain;
        if (color) map[n.su!] = color;
      });
    return map;
  }, [networkData?.isNeighborhood, allSus, nodes]);

  // Sync fetched data into local D3-mutable state
  useEffect(() => {
    if (!networkData) return;
    setNodes(networkData.nodes.map((node) => ({ ...node })));
    setLinks(networkData.links);
  }, [networkData]);

  useEffect(() => {
    if (!svgRef.current) return;

    // fallback dimensions
    const fallbackWidth = 960;
    const fallbackHeight = 600;

    // Dimensions
    const dimensions = {
      width: width ?? fallbackWidth,
      height: height ?? fallbackHeight,
      margins: { top: 20, right: 20, bottom: 20, left: 20 },
    };

    // deep copy / mutating props
    const nodesCopy = nodes.map((d) => ({ ...d }));
    const linksCopy = links.map((d) => ({ ...d }));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear before redraw

    // Set SVG dimensions
    svg.attr("width", dimensions.width).attr("height", dimensions.height - 80);

    // arrowheads
    const defs = svg.append("defs");
    defs
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", colorLight3);

    // container for zoom
    const g = svg.append("g").attr("class", "g-zoom-root");

    // zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (event: D3ZoomEvent) => {
        g.attr("transform", event.transform.toString());
      });

    svg.call(zoom);

    // Prepare link force with proper id accessor and safe cast to Force<NodeDatum, undefined>
    const linkForce = d3
      .forceLink<NodeDatum, LinkDatum>(linksCopy)
      .id((d: NodeDatum) => d.id)
      .distance(150) as unknown as d3.Force<NodeDatum, undefined>;

    // Create force simulation early so drag handlers can reference it
    const simulation = d3
      .forceSimulation<NodeDatum>(nodesCopy)
      .force("link", linkForce)
      .force("charge", d3.forceManyBody().strength(-250))
      .force(
        "center",
        d3.forceCenter(dimensions.width / 2, dimensions.height / 2),
      )
      .force("collision", d3.forceCollide().radius(50));

    // Build adjacency map for hover highlighting
    const neighborMap = new Map<string, Set<string>>();
    type D3Linkish = { source: unknown; target: unknown };
    const hasId = (x: unknown): x is { id: string | number } =>
      typeof x === "object" && x !== null && "id" in x;
    const getId = (x: unknown): string => {
      if (typeof x === "string" || typeof x === "number") return String(x);
      if (hasId(x)) return String(x.id);
      return "";
    };
    const addNeighbor = (a: string, b: string) => {
      if (!neighborMap.has(a)) neighborMap.set(a, new Set<string>());
      neighborMap.get(a)!.add(b);
    };
    linksCopy.forEach((l) => {
      const linkish = l as unknown as D3Linkish;
      const s = getId(linkish.source);
      const t = getId(linkish.target);
      if (s && t) {
        addNeighbor(s, t);
        addNeighbor(t, s);
      }
    });

    // link lines
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, D3Linkish>("line")
      .data(linksCopy as unknown as D3Linkish[])
      .join("line")
      .attr("stroke", colorLight3)
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow)");

    // node groups
    const node = g
      .append("g")
      .attr("class", "nodes")
      .selectAll<SVGGElement, NodeDatum>("g")
      .data(nodesCopy)
      .join("g")
      .attr("class", "node-group")
      .call(
        d3
          .drag<SVGGElement, NodeDatum>()
          .on(
            "start",
            function (
              event: d3.D3DragEvent<SVGGElement, NodeDatum, unknown>,
              d: NodeDatum,
            ) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
            },
          )
          .on(
            "drag",
            function (
              event: d3.D3DragEvent<SVGGElement, NodeDatum, unknown>,
              d: NodeDatum,
            ) {
              d.fx = event.x;
              d.fy = event.y;
            },
          )
          .on(
            "end",
            function (
              event: d3.D3DragEvent<SVGGElement, NodeDatum, unknown>,
              d: NodeDatum,
            ) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = event.x;
              d.fy = event.y;
            },
          ),
      )
      .on("mouseover", function (event: MouseEvent, d: NodeDatum) {
        const keep = new Set<string>([d.id]);
        const neigh = neighborMap.get(d.id);
        if (neigh) neigh.forEach((id) => keep.add(id));
        node.attr("opacity", (n: NodeDatum) => (keep.has(n.id) ? 1 : 0.15));
        link.attr("stroke-opacity", (l: D3Linkish) => {
          const s = getId(l.source);
          const t = getId(l.target);
          return s === d.id || t === d.id || (keep.has(s) && keep.has(t))
            ? 0.9
            : 0.1;
        });
      })
      .on("mouseout", function () {
        node.attr("opacity", 1);
        link.attr("stroke-opacity", 0.6);
      })
      .on("click", function (event: MouseEvent, d: NodeDatum) {
        // Stop propagation to prevent the SVG background click from closing the modal immediately
        if (typeof event.stopPropagation === "function")
          event.stopPropagation();
        setSelectedNode(d);
        setIsModalOpen(true);
      });

    // circles
    node
      .append("circle")
      .attr("r", (d) => (d.type === "parent" ? 40 : 14))
      .attr("fill", (d) => {
        if (d.type === "parent") return quartierMainColor;

        if (networkData?.isNeighborhood && typeof d.su === "number") {
          return suColorMap[d.su] ?? colorLight1;
        }
        return colorLight1;
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .attr("cursor", "pointer");

    // Side labels for child nodes
    node
      .filter((d) => d.type !== "parent")
      .append("text")
      .attr("x", 18)
      .attr("y", 4)
      .text((d) => d.label ?? d.id)
      .attr("font-size", 12)
      .attr("pointer-events", "auto")
      .attr("cursor", "pointer");

    // Emoji inside parent nodes (ensure these are appended last for stacking)
    node
      .filter((d) => d.type === "parent")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", 40)
      .attr("pointer-events", "none")
      .text((d) => d.emoji ?? "💬");

    // tick handler after elements exist
    type NodePosish = { x?: number; y?: number };
    const hasXY = (v: unknown): v is NodePosish =>
      typeof v === "object" && v !== null && ("x" in v || "y" in v);
    simulation.on("tick", () => {
      link
        .attr("x1", (d: D3Linkish) =>
          hasXY(d.source) && typeof d.source.x === "number" ? d.source.x : 0,
        )
        .attr("y1", (d: D3Linkish) =>
          hasXY(d.source) && typeof d.source.y === "number" ? d.source.y : 0,
        )
        .attr("x2", (d: D3Linkish) =>
          hasXY(d.target) && typeof d.target.x === "number" ? d.target.x : 0,
        )
        .attr("y2", (d: D3Linkish) =>
          hasXY(d.target) && typeof d.target.y === "number" ? d.target.y : 0,
        );

      node.attr(
        "transform",
        (d: NodeDatum) => `translate(${d.x ?? 0},${d.y ?? 0})`,
      );
    });

    // on click background to deselect
    svg.on("click", () => {
      setSelectedNode(null);
      setIsModalOpen(false);
    });

    // cleanup on unmount
    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [
    nodes,
    links,
    width,
    height,
    mainColor,
    colorLight1,
    colorLight3,
    networkData?.isNeighborhood,
    suColorMap,
    quartierMainColor,
  ]);

  return (
    <div ref={svgContainer} className="h-full w-full">
      <div className="mb-4 flex items-center justify-between px-4 pt-4">
        <h3 className="text-lg font-semibold">
          🗣 Carte mentale des témoignages
        </h3>
        <div className="space-x-2">
          {loading && (
            <span className="px-3 py-1 text-xs text-gray">Chargement...</span>
          )}
          {!loading && networkData && (
            <span className="px-3 py-1 text-xs text-gray">
              {networkData.totalTestimonies} témoignages •{" "}
              {networkData.subcategories.length} thêmes
            </span>
          )}
          <button
            className="rounded bg-blue px-3 py-1 text-xs text-white hover:opacity-90"
            onClick={() => void refetch()}
            disabled={loading}
          >
            Ré-initialiser
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pb-4">
        <svg ref={svgRef} className="h-full w-full rounded-lg border" />
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        node={selectedNode}
      />

      <div className="px-4 pb-2 text-xs text-gray">
        (●) Cliquez pour les détails d&apos;un témoignage. ☩ Faites glisser pour
        vous déplacer dans la carte. ↕ Scrollez pour zoomer (utilisez la molette
        de la souris).
      </div>
    </div>
  );
};

export { DvTestimonyNetwork };
export default DvTestimonyNetwork;

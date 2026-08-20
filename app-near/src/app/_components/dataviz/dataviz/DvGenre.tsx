"use client";

import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import { useSuBank } from "../hooks/useSuBank";
import { useChartDimensions } from "../hooks/useChartDimensions";
import PieChart, { type PieSlice } from "../../_ui/PieChart";
import DvAsync from "./DvAsync";

interface DvGenreProps {
  selectedSus?: number[];
}

const TITLE = "Répartition par genre";
const TITLE_EMOJI = "👨👩";
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 250;

const DvGenre: React.FC<DvGenreProps> = ({ selectedSus }) => {
  const { containerRef: svgContainer, width, height } = useChartDimensions();
  const {
    colorMain: mainColor,
    colorLight1: lightColor1,
    colorDark1: darkColor1,
  } = useSuBank(selectedSus);

  const {
    data: result,
    isLoading: loading,
    error,
  } = api.suDataviz.getSuAnswerDistribution.useQuery({
    field: "gender",
    selectedSus,
  });
  const data = result?.data.filter((d) => d.count > 0);

  const radius = useMemo(() => {
    const w = width ?? DEFAULT_WIDTH;
    const h = height ?? DEFAULT_HEIGHT;
    return Math.max(20, Math.min((w - 32) / 2, (h - 32) / 2));
  }, [width, height]);

  const slices = useMemo<PieSlice[]>(() => {
    if (!data) return [];
    return data.map((d, i) => ({
      key: d.label,
      label: d.label,
      value: d.count,
      color: i === 0 ? lightColor1 : darkColor1,
      emoji: d.emoji,
      tooltip: `${d.label} : ${d.percentage.toFixed(1)}% (${d.count})`,
    }));
  }, [data, lightColor1, darkColor1]);

  return (
    <DvAsync
      loading={loading}
      error={error}
      isEmpty={!data || data.length === 0}
      messages={{ loading: "Chargement des données de genre…" }}
      centered
    >
      <div className="flex h-full w-full flex-col">
        <div className="text-base font-bold" style={{ color: mainColor }}>
          {TITLE} {TITLE_EMOJI}
        </div>
        <div
          ref={svgContainer}
          className="flex min-h-0 flex-1 items-center justify-center"
        >
          <PieChart slices={slices} radius={radius} />
        </div>
      </div>
    </DvAsync>
  );
};

export default DvGenre;

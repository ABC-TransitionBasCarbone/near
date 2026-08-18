"use client";

import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import { useSuBank, getPalette } from "../hooks/useSuBank";
import StackedBarList, { type StackedBarRow } from "../../_ui/StackedBarList";

interface DvCspProps {
  selectedSus?: number[];
}

const TITLE = "Catégories socio-professionnelles";
const TITLE_EMOJI = "💼";

const DvCsp: React.FC<DvCspProps> = ({ selectedSus }) => {
  const suBank = useSuBank(selectedSus);
  const mainColor = suBank.colorMain;
  const colors = useMemo(() => getPalette(suBank, "graph"), [suBank]);

  const {
    data: result,
    isLoading: loading,
    error,
  } = api.suDataviz.getSuAnswerDistribution.useQuery({
    field: "professionalCategory",
    selectedSus,
  });
  const data = result?.data.filter((d) => d.count > 0);
  const unit = result?.isNeighborhood ? "habitants" : "réponses";

  const rows = useMemo<StackedBarRow[]>(() => {
    if (!data || data.length === 0) return [];
    return [
      {
        id: "csp",
        segments: data.map((d, i) => ({
          key: d.label,
          label: d.label,
          emoji: d.emoji,
          percentage: d.percentage,
          color: colors[i % colors.length] ?? colors[0] ?? mainColor,
          tooltip: `${d.emoji} ${d.label} : ${d.percentage.toFixed(1)}% (${d.count} ${unit})`,
        })),
      },
    ];
  }, [data, colors, mainColor, unit]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray">Chargement des données CSP...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center text-error">
        Erreur lors du chargement des données
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray">
        Aucune donnée disponible
      </div>
    );
  }

  return (
    <StackedBarList
      rows={rows}
      title={`${TITLE} ${TITLE_EMOJI}`}
      titleColor={mainColor}
      barHeight={40}
      showLegend
    />
  );
};

export default DvCsp;

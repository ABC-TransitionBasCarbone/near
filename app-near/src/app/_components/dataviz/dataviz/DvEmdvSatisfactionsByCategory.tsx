"use client";

import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import {
  type SatisfactionSubcategory,
  YES_NO_COLORS,
} from "~/shared/services/dataviz/satisfaction";
import StackedBarList, { type StackedBarRow } from "../../_ui/StackedBarList";

type Props = { selectedSus?: number[]; category?: SatisfactionSubcategory };

const DvEmdvSatisfactionsByCategory: React.FC<Props> = ({
  selectedSus,
  category,
}) => {
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

  const rows = useMemo<StackedBarRow[]>(
    () =>
      questions.map((q) => ({
        id: q.field,
        title: q.title,
        titleEmoji: q.emoji,
        segments: q.responses.map((r) => ({
          key: r.choice,
          label: r.label,
          percentage: r.percentage,
          color: YES_NO_COLORS[r.choice],
        })),
      })),
    [questions],
  );

  if (loading) {
    return (
      <div className="dv-container h-full w-full">
        <div className="p-3 text-gray">Chargement…</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="dv-container h-full w-full">
        <div className="p-3 text-error">
          Impossible de charger les satisfactions
        </div>
      </div>
    );
  }
  if (questions.length === 0) {
    return (
      <div className="dv-container h-full w-full">
        <div className="p-3 text-gray">Aucune donnée.</div>
      </div>
    );
  }

  return (
    <div className="dv-container h-full w-full">
      <StackedBarList rows={rows} minSegmentWidthForLabel={30} />
    </div>
  );
};

export default DvEmdvSatisfactionsByCategory;

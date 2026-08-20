"use client";

import React, { useMemo } from "react";
import { api } from "~/trpc/react";
import {
  type SatisfactionSubcategory,
  YES_NO_COLORS,
} from "~/shared/services/dataviz/satisfaction";
import StackedBarList, { type StackedBarRow } from "../../_ui/StackedBarList";
import DvAsync from "./DvAsync";

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

  return (
    <DvAsync
      loading={loading}
      error={error}
      isEmpty={questions.length === 0}
      messages={{ error: "Impossible de charger les satisfactions" }}
    >
      <div className="dv-container h-full w-full">
        <StackedBarList rows={rows} minSegmentWidthForLabel={30} />
      </div>
    </DvAsync>
  );
};

export default DvEmdvSatisfactionsByCategory;

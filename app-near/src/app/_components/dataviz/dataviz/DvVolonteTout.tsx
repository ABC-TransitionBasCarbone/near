"use client";

import React, { useMemo } from "react";
import { WishesChoices } from "@prisma/client";
import { api } from "~/trpc/react";
import StackedBarList, { type StackedBarRow } from "../../_ui/StackedBarList";
import DvAsync from "./DvAsync";

interface Props {
  selectedSus?: number[];
}

const COLOR_BY_CHOICE: Record<WishesChoices, string> = {
  [WishesChoices.YES_I_DO]: "#4CAF50",
  [WishesChoices.I_WISH_AND_IT_IS_PLAN]: "#b2bb33",
  [WishesChoices.I_WISH_BUT_CANT]: "#ff8c18",
  [WishesChoices.NO]: "#b31408",
};

const DvVolonteTout: React.FC<Props> = ({ selectedSus }) => {
  const {
    data,
    isLoading: loading,
    error,
  } = api.suDataviz.getWillingness.useQuery({ selectedSus });

  const rows = useMemo<StackedBarRow[]>(() => {
    if (!data) return [];
    return data.data.map((q) => ({
      id: q.field,
      title: q.title,
      titleEmoji: q.emoji,
      segments: q.responses
        .filter((r) => r.percentage > 0)
        .map((r) => ({
          key: r.choice,
          label: r.label,
          percentage: r.percentage,
          color: COLOR_BY_CHOICE[r.choice],
        })),
    }));
  }, [data]);

  return (
    <DvAsync
      loading={loading}
      error={error}
      isEmpty={!data || data.data.length === 0}
    >
      <div className="flex h-full w-full flex-col">
        <div className="flex-1 px-2 pb-2">
          <StackedBarList
            rows={rows}
            title="📊 Volontés de changement"
            headerRight={`${data?.data.length ?? 0} questions`}
            normalize
            minSegmentWidthForLabel={30}
            showLegend
          />
        </div>
      </div>
    </DvAsync>
  );
};

export { DvVolonteTout };
export default DvVolonteTout;

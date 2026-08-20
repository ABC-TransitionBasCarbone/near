"use client";

import React from "react";
import { api } from "~/trpc/react";
import type { SatisfactionQuestionResult } from "~/server/su/dataviz/satisfactionDistribution";
import { YES_NO_COLORS } from "~/shared/services/dataviz/satisfaction";
import PieChart, { type PieSlice } from "../../_ui/PieChart";
import DvAsync from "./DvAsync";

type Props = { selectedSus?: number[] };

const CARD_SIZE = 150;
const MARGIN = 10;

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
  const radius = CARD_SIZE / 2 - MARGIN;
  const innerRadius = radius * 0.38;

  const emojiCount = getEmojiCount(question.emoji);
  const centerFontSize =
    emojiCount >= 3
      ? Math.floor(innerRadius * 0.56)
      : emojiCount === 2
        ? Math.floor(innerRadius * 0.76)
        : Math.floor(innerRadius * 1.15);

  const slices: PieSlice[] = question.responses.map((r) => ({
    key: r.choice,
    label: r.label,
    value: r.percentage,
    color: YES_NO_COLORS[r.choice],
  }));

  return (
    <div
      className="dv-container relative flex flex-col items-center gap-1 px-2 pb-1.5 pt-2"
      style={{ width: CARD_SIZE + 32 }}
    >
      <PieChart
        slices={slices}
        radius={radius}
        innerRadiusRatio={0.38}
        centerContent={question.emoji}
        centerFontSize={centerFontSize}
        minLabelPercentage={5}
        labelTextColor="#333333"
        labelHalo={false}
      />
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

  return (
    <DvAsync loading={loading} error={error} isEmpty={!subcategories.length}>
      <div className="px-2 pb-6 pt-2">
        {subcategories.map((sc) => (
          <div key={sc.subcategory} className="zone-target mb-8">
            <h3 className="mx-1 mb-3 border-b border-grayLight pb-1.5 text-sm font-semibold text-black">
              {sc.emoji} {sc.label}
            </h3>
            <div className="flex flex-wrap justify-start gap-5 pl-1">
              {sc.questions.map((q) => (
                <EmdvPieCard key={q.field} question={q} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </DvAsync>
  );
};

export default DvEmdvSatisfactionsPieCharts;

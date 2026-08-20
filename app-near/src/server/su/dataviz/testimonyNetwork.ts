import { type WayOfLifeAnswer } from "@prisma/client";
import { db } from "~/server/db";
import {
  TESTIMONY_SUBCATEGORIES,
  type TestimonySubcategory,
} from "~/shared/services/dataviz/testimony";
import { resolveSuId } from "~/server/su/dataviz/suSelection";

type TestimonyField = Extract<
  keyof WayOfLifeAnswer,
  | "otherFoodFrequencyInformation"
  | "otherFoodSatisfactionInformation"
  | "otherHousingInformation"
  | "otherLocalPoliticInformation"
  | "otherMutualAidInformation"
  | "otherNeighborhoodLifeInformation"
  | "otherParksInformation"
  | "otherRepairShopSatisfactionInformation"
  | "otherServicesInformation"
  | "otherTransportationInformation"
  | "comment"
>;

const TESTIMONY_FIELDS: Record<
  TestimonyField,
  { subcategory: TestimonySubcategory; questionShort: string }
> = {
  otherFoodFrequencyInformation: {
    subcategory: "Food",
    questionShort: "Fréquence alimentaire",
  },
  otherFoodSatisfactionInformation: {
    subcategory: "Food",
    questionShort: "Satisfaction alimentaire",
  },
  otherHousingInformation: {
    subcategory: "Housing",
    questionShort: "Logement",
  },
  otherLocalPoliticInformation: {
    subcategory: "Politics",
    questionShort: "Participation citoyenne",
  },
  otherMutualAidInformation: {
    subcategory: "Solidarity",
    questionShort: "Entraide",
  },
  otherNeighborhoodLifeInformation: {
    subcategory: "NghLife",
    questionShort: "Vie de quartier",
  },
  otherParksInformation: {
    subcategory: "Parks",
    questionShort: "Parcs et espaces verts",
  },
  otherRepairShopSatisfactionInformation: {
    subcategory: "Shopping",
    questionShort: "Réparation / Shopping",
  },
  otherServicesInformation: {
    subcategory: "Services",
    questionShort: "Services",
  },
  otherTransportationInformation: {
    subcategory: "Mobility",
    questionShort: "Mobilité",
  },
  comment: { subcategory: "General", questionShort: "Commentaire général" },
};

export type TestimonyNode = {
  id: string;
  label?: string;
  group?: string;
  type: "parent" | "child";
  testimony?: string;
  su?: number;
  respondentGender?: string;
  respondentAge?: string;
  questionShort?: string;
  subcategory?: TestimonySubcategory;
  emoji?: string;
};

export type TestimonyLink = { source: string; target: string };

export type TestimonyNetworkResult = {
  nodes: TestimonyNode[];
  links: TestimonyLink[];
  isNeighborhood: boolean;
  totalTestimonies: number;
  subcategories: TestimonySubcategory[];
};

const TESTIMONY_SELECT = {
  gender: true,
  ageCategory: true,
  suId: true,
  otherFoodFrequencyInformation: true,
  otherFoodSatisfactionInformation: true,
  otherHousingInformation: true,
  otherLocalPoliticInformation: true,
  otherMutualAidInformation: true,
  otherNeighborhoodLifeInformation: true,
  otherParksInformation: true,
  otherRepairShopSatisfactionInformation: true,
  otherServicesInformation: true,
  otherTransportationInformation: true,
  comment: true,
} as const;

const isMeaningful = (value: string) => {
  const clean = value.trim();
  if (clean.length < 3) return false;
  const lower = clean.toLowerCase();
  return lower !== "non" && lower !== "null" && clean !== "{}";
};

export const getTestimonyNetwork = async (
  surveyId: number,
  selectedSus?: number[],
): Promise<TestimonyNetworkResult> => {
  const { isNeighborhood, suId } = await resolveSuId(surveyId, selectedSus);

  const [answers, sus] = await Promise.all([
    db.wayOfLifeAnswer.findMany({
      where: isNeighborhood ? { surveyId } : { surveyId, suId },
      select: TESTIMONY_SELECT,
    }),
    isNeighborhood
      ? db.suData.findMany({
          where: { surveyId },
          select: { id: true, su: true },
        })
      : Promise.resolve([]),
  ]);

  const suNumberById = new Map(sus.map((s) => [s.id, s.su]));

  const testimonies: TestimonyNode[] = [];
  const subcategoriesFound = new Set<TestimonySubcategory>();

  answers.forEach((answer, idx) => {
    for (const [field, meta] of Object.entries(TESTIMONY_FIELDS) as [
      TestimonyField,
      { subcategory: TestimonySubcategory; questionShort: string },
    ][]) {
      const raw = answer[field];
      if (!raw || !isMeaningful(raw)) continue;
      const clean = raw.trim();

      subcategoriesFound.add(meta.subcategory);
      testimonies.push({
        id: `testimony_${idx}_${field}`,
        label: clean.length > 100 ? `${clean.slice(0, 97)}...` : clean,
        group: meta.subcategory,
        type: "child",
        testimony: clean,
        su: isNeighborhood
          ? answer.suId
            ? suNumberById.get(answer.suId)
            : undefined
          : selectedSus?.[0],
        respondentGender: answer.gender,
        respondentAge: answer.ageCategory,
        questionShort: meta.questionShort,
      });
    }
  });

  const subcategories = Array.from(subcategoriesFound).sort();

  const parentNodes: TestimonyNode[] = subcategories.map((subcategory) => ({
    id: `parent_${subcategory}`,
    label: TESTIMONY_SUBCATEGORIES[subcategory]?.emoji ?? "🗣️",
    group: subcategory,
    type: "parent",
    subcategory,
    emoji: TESTIMONY_SUBCATEGORIES[subcategory]?.emoji ?? "🗣️",
  }));

  const links: TestimonyLink[] = testimonies.map((t) => ({
    source: t.id,
    target: `parent_${t.group}`,
  }));

  return {
    nodes: [...parentNodes, ...testimonies],
    links,
    isNeighborhood,
    totalTestimonies: testimonies.length,
    subcategories,
  };
};

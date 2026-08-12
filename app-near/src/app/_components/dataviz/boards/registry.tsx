import { FicheSuBoard } from "./FicheSuBoard";
import CarbonBoard from "./CarbonBoard";
import { TestimonyBoard } from "./TestimonyBoard";
import { EmdvByCategoryBoards } from "./EmdvByCategoryBoards";
import EmdvPieChartsBoard from "./EmdvPieChartsBoards";
import BarrierBoards from "./BarrierBoards";
import BarrierQuestionBoards from "./BarrierQuestionBoards";
import VolonteBoard from "./VolonteBoard";
import MobilityBoard from "./MobilityBoard";
import { type Board } from "~/types/Dataviz";

export const BOARD_REGISTRY: Board[] = [
  FicheSuBoard,
  CarbonBoard,
  EmdvPieChartsBoard,
  MobilityBoard,
  VolonteBoard,
  ...BarrierBoards,
  ...BarrierQuestionBoards,
  ...EmdvByCategoryBoards,
  TestimonyBoard,
];

export const getBoardById = (id: string): Board | undefined => {
  return BOARD_REGISTRY.find((board) => board.id === id);
};

export const getDefaultBoard = (): Board => {
  return BOARD_REGISTRY[0]!;
};

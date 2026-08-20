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

export type BoardGroup = {
  main: Board;
  subBoards?: Board[];
};

export const BOARD_GROUPS: BoardGroup[] = [
  { main: FicheSuBoard },
  { main: CarbonBoard },
  { main: EmdvPieChartsBoard, subBoards: EmdvByCategoryBoards },
  { main: MobilityBoard },
  { main: VolonteBoard },
  { main: BarrierBoards[0]!, subBoards: BarrierQuestionBoards },
  { main: TestimonyBoard },
];

export const BOARD_REGISTRY: Board[] = BOARD_GROUPS.flatMap((group) => [
  group.main,
  ...(group.subBoards ?? []),
]);

export const getBoardById = (id: string): Board | undefined => {
  return BOARD_REGISTRY.find((board) => board.id === id);
};

export const getDefaultBoard = (): Board => {
  return BOARD_REGISTRY[0]!;
};

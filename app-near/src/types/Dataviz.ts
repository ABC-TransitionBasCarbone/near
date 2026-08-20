export type SuInfo = {
  id: number;
  su: number;
  popPercentage: number;
  realPopulation: number;
  icon: string;
  bankData: SuBankData | null;
};

export type SuBankData = {
  id: number;
  name: string;
  icon1: string;
  icon2: string;
  ornement: string;
  background: string;
  colorMain: string;
  colorDark1: string;
  colorDark2: string;
  colorDark3: string;
  colorDark4: string;
  colorDark5: string;
  colorLight1: string;
  colorLight2: string;
  colorLight3: string;
  colorLight4: string;
  colorLight5: string;
  colorComp1: string;
  colorComp2: string;
  colorGraph1: string;
  colorGraph2: string;
  colorGraph3: string;
  colorGraph4: string;
  colorGraph5: string;
  colorGraph6: string;
  colorGraph7: string;
  colorGraph8: string;
  colorGraph9: string;
  colorGraph10: string;
  position: string;
  icon1Link: string;
  icon1Source: string;
  icon1Attribution: string;
  icon2Link: string;
  icon2Source: string;
  icon2Attribution: string;
  ornementLink: string;
  ornementSource: string;
  ornementAttribution: string;
  backgroundBin: string;
  backgroundFilepath: string;
  backgroundLink: string;
  backgroundSource: string;
};

export interface Board {
  id: string;
  name: string;
  emoji: string;
  description: string;
  renderComponent: (props: { selectedSus?: number[] }) => React.ReactElement;
}

export type MenuState = {
  selectedBoard: string;
  selectedSus: number[];
  availableSus: SuInfo[];
};

export type IconValidationResult = {
  isValid: boolean;
  sanitizedIcon?: string;
  errors: string[];
  warnings: string[];
};

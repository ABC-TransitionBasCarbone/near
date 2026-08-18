// Demographie Board - Age, CSP, genre des échantillons par SU + données INSEE pour le quartier

import { type Board } from "~/types/Dataviz";
import DvSuTitle from "../dataviz/DvSuTitle";
import DvAgeDistribution from "../dataviz/DvAgeDistribution";
import DvGenre from "../dataviz/DvGenre";
import DvCsp from "../dataviz/DvCsp";
import DvUsages from "../dataviz/DvUsages";
import DvCarbonSankey from "../dataviz/DvCarbonSankey";

export const FicheSuBoard: Board = {
  id: "SU",
  name: "Sphères d'Usages",
  emoji: "🔮",
  description:
    "Découvrir la sociologie et les grandes habitudes du quartier et des différentes S.U. : âges, catégories socio-professionnelles et genre",
  renderComponent: ({ selectedSus }: { selectedSus?: number[] }) => (
    <div className="demographie-board flex h-full flex-col overflow-y-auto overflow-x-hidden p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          {FicheSuBoard.emoji} {FicheSuBoard.name}
        </h2>
        <p className="mt-1 text-sm text-gray">{FicheSuBoard.description}</p>
      </header>

      {/* <div className="board-grid grid flex-1 grid-cols-1 gap-4 md:grid-cols-2"> */}
      <div className="board-grid flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="dv-container title-dist h-[260px] min-w-0 rounded-lg border border-grayLight bg-white p-3 md:flex-1 md:basis-0">
            <DvSuTitle selectedSus={selectedSus} />
          </div>

          <div className="dv-container age-dist h-[260px] min-w-0 rounded-lg border border-grayLight bg-white p-3 md:flex-1 md:basis-0">
            <DvAgeDistribution selectedSus={selectedSus} />
          </div>

          <div className="dv-container genre-dist h-[260px] min-w-0 rounded-lg border border-grayLight bg-white p-3 md:flex-1 md:basis-0">
            <DvGenre selectedSus={selectedSus} />
          </div>
        </div>

        <div className="dv-container csp-dist rounded-lg border border-grayLight bg-white p-3">
          <DvCsp selectedSus={selectedSus} />
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="dv-container usages-dist h-[950px] min-w-0 rounded-lg border border-grayLight bg-white p-3 md:col-span-2 md:flex-1 md:basis-0">
            <DvUsages selectedSus={selectedSus} />
          </div>

          <div className="dv-container sankey-dist h-[950px] min-w-0 rounded-lg border border-grayLight bg-white p-3 md:col-span-2 md:flex-1 md:basis-0">
            <DvCarbonSankey selectedSus={selectedSus} />
          </div>
        </div>
      </div>
    </div>
  ),
};

export default FicheSuBoard;

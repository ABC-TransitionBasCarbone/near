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
    <div className="demographie-board flex h-full flex-col overflow-y-auto p-4">
      <header className="mb-4">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-black">
          {FicheSuBoard.emoji} {FicheSuBoard.name}
        </h2>
        <p className="mt-1 text-sm text-gray">{FicheSuBoard.description}</p>
      </header>

      <div className="board-grid grid flex-1 grid-cols-3 gap-4">
        <div className="dv-container title-dist rounded-lg border border-grayLight bg-white p-3">
          <DvSuTitle selectedSus={selectedSus} />
        </div>

        <div className="dv-container empty-dist min-h-[260px] rounded-lg border border-grayLight bg-white p-3">
          <DvAgeDistribution selectedSus={selectedSus} />
        </div>

        <div className="dv-container genre-dist min-h-[260px] rounded-lg border border-grayLight bg-white p-3">
          <DvGenre selectedSus={selectedSus} />
        </div>

        <div className="dv-container age-dist rounded-lg border border-dashed border-grayLight">
          {/* Empty */}
        </div>

        <div className="dv-container csp-dist min-h-[260px] rounded-lg border border-grayLight bg-white p-3">
          <DvCsp selectedSus={selectedSus} />
        </div>

        <div className="dv-container space-dist rounded-lg border border-dashed border-grayLight">
          {/* Empty */}
        </div>

        <div className="dv-container usages-dist min-h-[260px] rounded-lg border border-grayLight bg-white p-3">
          <DvUsages selectedSus={selectedSus} />
        </div>

        <div className="dv-container sankey-dist min-h-[260px] rounded-lg border border-grayLight bg-white p-3">
          <DvCarbonSankey selectedSus={selectedSus} />
        </div>

        <div className="dv-container bottom-dist flex items-center justify-center">
          <p className="text-xs text-gray">
            Diagnostic NEAR 2025 - Porte d&#39;Orléans
          </p>
        </div>
      </div>
    </div>
  ),
};

export default FicheSuBoard;

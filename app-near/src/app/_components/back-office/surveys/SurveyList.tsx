import { useState } from "react";
import { api } from "~/trpc/react";
import Table from "../../_ui/Table";
import { SurveyListColumns } from "./surveyList.columns";
import { useDebounced } from "../../_ui/hooks/useDebounced";
import Button from "../../_ui/Button";
import { useRouter } from "next/navigation";

const SurveyList: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 300);

  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filtrer par nom"
          className="w-64 rounded border p-2"
        />
        <Button onClick={() => router.push("/back-office/quartiers/edit")}>
          Ajouter un quartier
        </Button>
      </div>

      <Table
        columns={SurveyListColumns}
        fetcherHook={(params) => api.surveys.querySurveys.useQuery(params)}
        filter={debouncedSearch}
      />
    </div>
  );
};

export default SurveyList;

import { useState } from "react";
import { api } from "~/trpc/react";
import Table from "../../_ui/Table";
import { SurveyListColumns } from "./surveyList.columns";
import { useDebounced } from "../../_ui/hooks/useDebounced";

const SurveyList: React.FC = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 300);

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filtrer par nom"
        className="w-64 rounded border p-2"
      />

      <Table
        columns={SurveyListColumns}
        fetcherHook={(params) => api.surveys.getAll.useQuery(params)}
        filter={debouncedSearch}
        onRowClick={() => console.log("todo")}
      />
    </div>
  );
};

export default SurveyList;

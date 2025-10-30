import { useState } from "react";
import { api } from "~/trpc/react";
import Table from "../../_ui/Table";
import { UserListColumns } from "./uersList.columns";
import { useDebounced } from "../../_ui/hooks/useDebounced";
import Button from "../../_ui/Button";
import { useRouter } from "next/navigation";

const UserList: React.FC = () => {
  const [search] = useState("");

  const router = useRouter();

  return (
    <div className="space-y-4">
      <div className="flex flex-row-reverse">
        <Button onClick={() => router.push("/back-office/utilisateurs/edit")}>
          Ajouter un utilisateur
        </Button>
      </div>

      <Table
        columns={UserListColumns}
        fetcherHook={(params) => api.users.queryUsers.useQuery(params)}
        filter={search}
      />
    </div>
  );
};

export default UserList;

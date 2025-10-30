import { type Survey } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const UserListColumns: ColumnDef<Survey>[] = [
  { accessorKey: "email", header: "Email" },
  { accessorKey: "surveyId", header: "Enquête" },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    accessorFn: ({ createdAt }) =>
      new Date(createdAt).toISOString().substring(0, 10),
  },
];

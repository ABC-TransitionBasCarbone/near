import { type Survey } from "@prisma/client";
import { type ColumnDef } from "@tanstack/react-table";

export const SurveyListColumns: ColumnDef<Survey>[] = [
  { accessorKey: "name", header: "Nom" },
  { accessorKey: "phase", header: "Phase" },
  {
    accessorKey: "createdAt",
    header: "Date de création",
    accessorFn: ({ createdAt }) =>
      new Date(createdAt).toISOString().substring(0, 10),
  },
];

"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";
import { useState } from "react";
import { type PaginatedResult } from "~/types/Table";

interface FilterParams<TFilter> {
  page: number;
  limit: number;
  filter: TFilter;
}

interface TableProps<TData, TValue, TFilter> {
  columns: ColumnDef<TData, TValue>[];
  fetcherHook: (params: FilterParams<TFilter>) => {
    data?: PaginatedResult<TData>;
    isLoading: boolean;
  };
  filter: TFilter;
  onRowClick?: (e: React.MouseEvent, row: Row<TData>, rowIndex: number) => void;
  limit?: number;
}

const Table = <TData, TValue, TFilter>({
  columns,
  fetcherHook,
  filter,
  onRowClick,
  limit = 10,
}: TableProps<TData, TValue, TFilter>) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = fetcherHook({
    page,
    limit,
    filter: filter,
  });

  const table = useReactTable({
    data: data?.items ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: data?.pages,
  });

  if (isLoading) return <p>Chargement...</p>;
  if (!data) return <p>Aucune donnée.</p>;

  return (
    <div className="space-y-4">
      <table className="min-w-full table-auto bg-white">
        <thead className="bg-grayExtraLight text-blue">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="cursor-pointer border-b border-grayLight px-2 py-2 text-left text-xs font-medium md:text-sm lg:text-base"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row, rowIndex) => (
            <tr
              key={row.id}
              onClick={(e) => onRowClick?.(e, row, rowIndex)}
              className={`${onRowClick ? "cursor-pointer hover:bg-grayExtraLight" : ""}`}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border-b border-grayLight px-2 py-4 text-xs md:text-sm lg:text-base"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <span>
          Page {page} sur {data.pages} ({data.total} résultats)
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="rounded border px-2 py-1"
          >
            Précédent
          </button>
          <button
            disabled={page === data.pages}
            onClick={() => setPage(page + 1)}
            className="rounded border px-2 py-1"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;

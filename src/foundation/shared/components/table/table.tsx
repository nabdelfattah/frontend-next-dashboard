"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./table-primitives";
import Pagination from "./pagination";
import {
  TableProps,
  TableSortState,
} from "./types";
import { buildDisplayColumns, renderCell, resolveRowActions } from "./utils";
import ActionsButton from "../actions-button";
import HeaderCellMenu from "./header-cell-menu";

export type {
  TableMetaDataEnumOption,
  TableMetaDataColumn,
  TablePaging,
  TableItem,
  TableData,
  ImageGroup,
} from "./types";


export default function Table({ tableData, actions, onPageChange }: TableProps) {
  const t = useTranslations("shared.table");
  const { paging, metaData, items } = tableData;

  const columns = [...metaData]
    .filter((column) => column.isPublic !== -1)
    .sort((a, b) => a.order - b.order); // sorts the columns array according to order

  const displayColumns = buildDisplayColumns(columns);

  const idColumn = metaData.find((column) => column.isPublic === -1);
  const hasActions = Boolean(actions && actions.length > 0);

  // Local-only for now: sorting/filtering doesn't affect `items` or emit a
  // TableQuery yet (that lands once server-side wiring is added later).
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [committedFilters, setCommittedFilters] = useState<Record<string, string>>({});

  const handleSort = (field: string, order: "asc" | "desc" | null) => {
    setSort(order === null ? null : { field, order });
  };

  const handleApplyFilter = (field: string, value: string) => {
    setCommittedFilters((prev) => {
      if (!value) {
        const { [field]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: value };
    });
  };

  // Clears the filter for the specified field from the committed filters.
  const handleClearFilter = (field: string) => {
    setCommittedFilters((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] border border-gray-200">
      <div className="max-w-full overflow-x-auto overflow-y-hidden">
        <div className="min-w-[1102px]">
          <TablePrimitive>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow className="w-fit">
                {displayColumns.map(({ column }) => (
                  <TableCell
                    key={column.secondaryCode}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs whitespace-nowrap dark:text-gray-400"
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.name || column.secondaryCode}</span>
                      <HeaderCellMenu
                        column={column}
                        sortOrder={
                          sort?.field === column.secondaryCode ? sort.order : null
                        }
                        committedFilter={committedFilters[column.secondaryCode]}
                        onSort={(order) => handleSort(column.secondaryCode, order)}
                        onApplyFilter={(value) =>
                          handleApplyFilter(column.secondaryCode, value)
                        }
                        onClearFilter={() => handleClearFilter(column.secondaryCode)}
                      />
                    </div>
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs whitespace-nowrap dark:text-gray-400"
                  >
                    {t("actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {items.map((item, index) => {
                const rowId = idColumn
                  ? String(item[idColumn.secondaryCode])
                  : String(index);

                return (
                  <TableRow key={rowId}>
                    {displayColumns.map(({ column, imageColumn }) => (
                      <TableCell
                        key={column.secondaryCode}
                        className="px-5 py-4 text-start whitespace-nowrap"
                      >
                        {renderCell(column, item, imageColumn)}
                      </TableCell>
                    ))}
                    {hasActions && (
                      <TableCell className="px-5 py-4 text-start whitespace-nowrap">
                        <ActionsButton
                          actions={resolveRowActions(actions, rowId)}
                        />
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </TablePrimitive>
        </div>
      </div>

      {paging.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4 dark:border-white/[0.05]">
          <span className="text-gray-500 text-theme-sm dark:text-gray-400">
            {`${paging.startItem}-${paging.endItem} of ${paging.totalItems}`}
          </span>
          <Pagination
            currentPage={paging.currentPage}
            totalPages={paging.totalPages}
            onPageChange={(page) => onPageChange?.(page)}
          />
        </div>
      )}
    </div>
  );
}

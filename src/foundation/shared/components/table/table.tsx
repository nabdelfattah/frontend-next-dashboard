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
import SelectionBar from "../selection-bar";
import ConfirmDialog from "../confirm-dialog";
import Checkbox from "../form/input/checkbox";

export type {
  TableMetaDataEnumOption,
  TableMetaDataColumn,
  TablePaging,
  TableItem,
  TableData,
  ImageGroup,
} from "./types";


/**
 * Generic, column-driven data table for admin/dashboard list pages.
 *
 * Everything it renders is derived from `tableData.metaData` — one entry per
 * column (`secondaryCode`, `name`, `type`, `enum`, `order`, `isPublic`) — and
 * `tableData.items`, the current page's rows. The table itself never fetches,
 * sorts, or filters data; it only renders whatever `tableData` it's given and
 * reports back what the user did with it:
 *
 * - **Columns** are built from `metaData`, filtered to `isPublic !== -1` and
 *   ordered by `order`. The one column with `isPublic === -1` isn't rendered
 *   at all — it's used internally as each row's id (for React keys, the
 *   selection set, and per-row actions).
 * - **Cell rendering** is driven by each column's `type`: `IMAGE` (merged
 *   into the next column instead of getting its own — e.g. an avatar next to
 *   a name), `IMAGE_GROUP` (overlapping avatar stack with a hover panel),
 *   `DATE`, `RATING`, or `STRING`/`NUMBER` (rendered as a `Badge` when the
 *   column has an `enum`, plain text otherwise).
 * - **Sorting/filtering** live behind each sortable/filterable column's "⋮"
 *   header menu (see `isSortable`/`isFilterable` in `./utils`). This is
 *   currently local-only state — it doesn't affect the rendered `items` or
 *   emit a query; server-side wiring lands separately.
 * - **Row actions**: pass `actions` to add a trailing "Actions" column
 *   rendered via `ActionsButton`. Each entry's `path` gets `/{rowId}`
 *   appended and each `action` callback is called with the row's id — see
 *   `resolveRowActions`.
 * - **Row selection + bulk delete**: pass `onBulkDelete` to turn on a
 *   leading checkbox column (tri-state "select all" for the current page)
 *   and a floating bar that appears once at least one row is selected.
 *   Selection is a `Set` keyed by the hidden id column and persists across
 *   `tableData` changes (e.g. paging) until cleared. The bar's Delete button
 *   opens a confirm dialog; accepting it calls `onBulkDelete` with the
 *   selected ids and clears the selection. There's no separate `selectable`
 *   flag — passing `onBulkDelete` is what enables selection.
 * - **Pagination** is rendered from `tableData.paging` (hidden when there's
 *   only one page) and reported back via `onPageChange`.
 *
 * @param tableData - `{ paging, metaData, items }` for the page currently being shown.
 * @param actions - Optional per-row actions, rendered as a trailing "Actions" column.
 * @param onPageChange - Called with the requested page number when the user paginates.
 * @param onBulkDelete - Called with the selected rows' ids after the bulk-delete confirm dialog is accepted. Also what turns on row selection.
 *
 * @example
 * <Table
 *   tableData={tableData}
 *   actions={[{ label: "Edit", path: "/users" }]}
 *   onBulkDelete={(ids) => deleteUsers(ids)}
 *   onPageChange={(page) => fetchPage(page)}
 * />
 */
export default function Table({
  tableData,
  actions,
  onPageChange,
  onBulkDelete,
}: TableProps) {
  const t = useTranslations("shared.table");
  const { paging, metaData, items } = tableData;

  const columns = [...metaData]
    .filter((column) => column.isPublic !== -1)
    .sort((a, b) => a.order - b.order); // sorts the columns array according to order

  const displayColumns = buildDisplayColumns(columns);

  const idColumn = metaData.find((column) => column.isPublic === -1);
  const hasActions = Boolean(actions && actions.length > 0);
  const selectable = Boolean(onBulkDelete);

  // Local-only for now: sorting/filtering doesn't affect `items` or emit a
  // TableQuery yet (that lands once server-side wiring is added later).
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [committedFilters, setCommittedFilters] = useState<Record<string, string>>({});

  // Persists across page changes (not reset when `items`/`paging` change) —
  // only row toggling, select-all, clearing, or a confirmed bulk delete touch it.
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const pageRowIds = items.map((item, index) =>
    idColumn ? String(item[idColumn.secondaryCode]) : String(index)
  );
  const selectedOnPageCount = pageRowIds.filter((id) => selectedIds.has(id)).length;
  const allOnPageSelected =
    pageRowIds.length > 0 && selectedOnPageCount === pageRowIds.length;
  const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected;

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAllOnPage = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      pageRowIds.forEach((id) => {
        if (checked) next.add(id);
        else next.delete(id);
      });
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleConfirmBulkDelete = () => {
    onBulkDelete?.(Array.from(selectedIds));
    clearSelection();
    setIsConfirmOpen(false);
  };

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
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="min-w-[1102px]">
          <TablePrimitive>
            <TableHeader className="border-b border-border">
              <TableRow className="w-fit">
                {selectable && (
                  <TableCell isHeader className="w-11 px-5 py-3">
                    <Checkbox
                      checked={allOnPageSelected}
                      indeterminate={someOnPageSelected}
                      onChange={toggleSelectAllOnPage}
                    />
                  </TableCell>
                )}
                {displayColumns.map(({ column }) => (
                  <TableCell
                    key={column.secondaryCode}
                    isHeader
                    className="px-5 py-3 font-medium text-muted-foreground text-start text-theme-xs whitespace-nowrap"
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
                    className="px-5 py-3 font-medium text-muted-foreground text-start text-theme-xs whitespace-nowrap"
                  >
                    {t("actions")}
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border">
              {items.map((item, index) => {
                const rowId = idColumn
                  ? String(item[idColumn.secondaryCode])
                  : String(index);

                return (
                  <TableRow key={rowId}>
                    {selectable && (
                      <TableCell className="w-11 px-5 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedIds.has(rowId)}
                          onChange={(checked) => toggleRow(rowId, checked)}
                        />
                      </TableCell>
                    )}
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
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <span className="text-muted-foreground text-theme-sm">
            {`${paging.startItem}-${paging.endItem} of ${paging.totalItems}`}
          </span>
          <Pagination
            currentPage={paging.currentPage}
            totalPages={paging.totalPages}
            onPageChange={(page) => onPageChange?.(page)}
          />
        </div>
      )}

      {selectable && (
        <>
          <SelectionBar
            count={selectedIds.size}
            onDelete={() => setIsConfirmOpen(true)}
            onClear={clearSelection}
          />
          <ConfirmDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={handleConfirmBulkDelete}
            title={t("confirmDeleteTitle")}
            message={t("confirmDeleteMessage", { count: selectedIds.size })}
            confirmLabel={t("delete")}
            cancelLabel={t("cancel")}
            isDanger
          />
        </>
      )}
    </div>
  );
}

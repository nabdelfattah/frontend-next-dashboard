"use client";

import { useEffect, useState } from "react";
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
import PageSizeSelect, { PAGE_SIZE_OPTIONS, PageSize } from "./page-size-select";
import { shallowEqualRecord } from "../../utils/shallow-equal-record";

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
 *   header menu (see `isSortable`/`isFilterable` in `./utils`). The table
 *   doesn't apply either itself — it reports the change via `onSortChange`/
 *   `onFilterChange` (and resets to page 1) so a parent page can fold it
 *   into a real query, typically alongside `SearchToolbar`'s own reports.
 *   Pass `filters` back down so a column's menu doesn't go stale when the
 *   same field is changed from elsewhere (e.g. `SearchToolbar`).
 * - **Rows per page**: a picker next to `Pagination`, fixed to 6/12/24.
 *   Picking a size resets to page 1 and calls `onPageSizeChange`; the page
 *   count shown is computed from `tableData.paging.totalItems` for whichever
 *   size is picked.
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
 * @param onPageChange - Called with the requested page number when the user paginates. Never resets itself — this IS the plain pagination click.
 * @param onBulkDelete - Called with the selected rows' ids after the bulk-delete confirm dialog is accepted. Also what turns on row selection.
 * @param onSortChange - Called with the new sort (`{ field, order }` or `null`) whenever the user sorts a column. Also resets to page 1.
 * @param onFilterChange - Called with one column's `secondaryCode` and its new value whenever a column filter is applied or cleared. Also resets to page 1.
 * @param filters - Authoritative filter values, if shared with something else (e.g. `SearchToolbar`) via a parent page. Keeps a column's filter menu from going stale when the field is changed elsewhere.
 * @param onPageSizeChange - Called with the newly picked rows-per-page value. Also resets to page 1.
 *
 * @example
 * <Table
 *   tableData={tableData}
 *   actions={[{ label: "Edit", path: "/users" }]}
 *   onBulkDelete={(ids) => deleteUsers(ids)}
 *   filters={filters}
 *   onSortChange={(sort) => setSort(sort)}
 *   onFilterChange={(field, value) => setFilters((prev) => ({ ...prev, [field]: value }))}
 *   onPageSizeChange={(size) => setLimit(size)}
 *   onPageChange={(page) => setPage(page)}
 * />
 */
export default function Table({
  tableData,
  actions,
  onPageChange,
  onBulkDelete,
  onSortChange,
  onFilterChange,
  filters: externalFilters,
  onPageSizeChange,
}: TableProps) {
  const t = useTranslations("shared.table");
  const { paging, metaData, items } = tableData;

  const columns = [...metaData]
    .filter((column) => column.isPublic !== -1)
    .sort((a, b) => a.order - b.order); // sorts the columns array according to order

  const displayColumns = buildDisplayColumns(columns);

  // ───────────────────────────────────────────────────────────────────────
  // COLUMNS
  // ───────────────────────────────────────────────────────────────────────
  const idColumn = metaData.find((column) => column.isPublic === -1);
  const hasActions = Boolean(actions && actions.length > 0);
  const selectable = Boolean(onBulkDelete);

  // ───────────────────────────────────────────────────────────────────────
  // PAGINATION
  // Local-only for now: doesn't affect `items`, isn't sent to the API/TableQuery.
  // `totalItems` still comes from `paging` (the real count), so the page count
  // it implies is correct; the rows shown don't actually change with it yet.
  // ───────────────────────────────────────────────────────────────────────
  const [pageSize, setPageSize] = useState<PageSize>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(paging.currentPage);

  const totalPages = Math.max(1, Math.ceil(paging.totalItems / pageSize));
  const displayPage = Math.min(currentPage, totalPages);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const handlePageSizeChange = (size: PageSize) => {
    setPageSize(size);
    setCurrentPage(1);
    onPageChange?.(1);
    onPageSizeChange?.(size);
  };

  // ───────────────────────────────────────────────────────────────────────
  // SORTING & FILTERING
  // Local-only for now: doesn't affect `items` or emit a TableQuery yet
  // (that lands once server-side wiring is added later).
  // ───────────────────────────────────────────────────────────────────────
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [committedFilters, setCommittedFilters] = useState<Record<string, string>>({});

  // Resyncs from `filters` when it changes from *outside* this table (e.g.
  // the same field was set via SearchToolbar). Guarded by the equality check
  // so this never fires from our own edits round-tripping back through the
  // parent. No remount trick needed here (unlike SearchToolbar's uncontrolled
  // inputs) — a column's filter widget only ever reads `committedFilter` at
  // the moment its popover opens, so keeping `committedFilters` in sync is
  // enough; the trigger's highlighted state (driven straight from
  // `committedFilters` on every render) updates immediately either way.
  useEffect(() => {
    if (!externalFilters) return;
    if (shallowEqualRecord(externalFilters, committedFilters)) return;
    setCommittedFilters(externalFilters);
    // Intentionally only reacting to the prop — `committedFilters` is read
    // for the equality check, not as a trigger (that would refire on our
    // own edits).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalFilters]);

  const handleSort = (field: string, order: "asc" | "desc" | null) => {
    const nextSort = order === null ? null : { field, order };
    setSort(nextSort);
    onSortChange?.(nextSort);
    setCurrentPage(1);
    onPageChange?.(1);
  };

  const handleApplyFilter = (field: string, value: string) => {
    setCommittedFilters((prev) => {
      if (!value) {
        const { [field]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [field]: value };
    });
    onFilterChange?.(field, value);
    setCurrentPage(1);
    onPageChange?.(1);
  };

  // Clears the filter for the specified field from the committed filters.
  const handleClearFilter = (field: string) => {
    setCommittedFilters((prev) => {
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
    onFilterChange?.(field, "");
    setCurrentPage(1);
    onPageChange?.(1);
  };

  // ───────────────────────────────────────────────────────────────────────
  // ROW SELECTION & BULK DELETE
  // Selection persists across page changes (not reset when `items`/`paging`
  // change) — only row toggling, select-all, clearing, or a confirmed bulk
  // delete touch it.
  // ───────────────────────────────────────────────────────────────────────
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

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="min-w-[1102px]">
          <TablePrimitive>
            {/* ─────────────────────── HEADER ROW ─────────────────────── */}
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

            {/* ─────────────────────── TABLE ROWS ─────────────────────── */}
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

      {/* ────────────── FOOTER: ROW COUNT, PAGE SIZE & PAGINATION ────────────── */}
      {paging.totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <span className="text-muted-foreground text-theme-sm">
            {`${paging.startItem}-${paging.endItem} of ${paging.totalItems}`}
          </span>
          <div className="flex items-center gap-4">
            <PageSizeSelect value={pageSize} onChange={handlePageSizeChange} />
            {totalPages > 1 && (
              <Pagination
                currentPage={displayPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      )}

      {/* ────────────── SELECTION BAR & BULK-DELETE CONFIRM DIALOG ────────────── */}
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

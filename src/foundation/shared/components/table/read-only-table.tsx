"use client";

import {
  Table as TablePrimitive,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./table-primitives";
import { TableData } from "./types";
import { buildDisplayColumns, renderCell } from "./utils";

interface ReadOnlyTableProps {
  tableData: TableData;
}

/**
 * A plain, read-only variant of `Table`: the same column-driven rendering —
 * columns built from `tableData.metaData`, cells drawn via `renderCell`/
 * `buildDisplayColumns` (badges, dates, ratings, image groups, avatars
 * merged into the next column — all identical to `Table`) — but nothing
 * else. No sorting, filtering, row selection, bulk delete, row actions, or
 * pagination controls.
 *
 * Use this instead of `Table` when a list is genuinely static (a summary
 * table, a printable view, an embedded preview) and none of `Table`'s
 * interactive features make sense.
 *
 * @param tableData - `{ paging, metaData, items }` for the rows to show. `paging` is accepted only for shape-compatibility with `Table`'s own `tableData` prop — this component never paginates and ignores it.
 *
 * @example
 * <ReadOnlyTable tableData={tableData} />
 */
export default function ReadOnlyTable({ tableData }: ReadOnlyTableProps) {
  const { metaData, items } = tableData;

  const columns = [...metaData]
    .filter((column) => column.isPublic !== -1)
    .sort((a, b) => a.order - b.order); // sorts the columns array according to order

  const displayColumns = buildDisplayColumns(columns);
  const idColumn = metaData.find((column) => column.isPublic === -1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="max-w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <div className="min-w-[1102px]">
          <TablePrimitive>
            <TableHeader className="border-b border-border">
              <TableRow className="w-fit">
                {displayColumns.map(({ column }) => (
                  <TableCell
                    key={column.secondaryCode}
                    isHeader
                    className="px-5 py-3 font-medium text-muted-foreground text-start text-theme-xs whitespace-nowrap"
                  >
                    {column.name || column.secondaryCode}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-border">
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
                  </TableRow>
                );
              })}
            </TableBody>
          </TablePrimitive>
        </div>
      </div>
    </div>
  );
}

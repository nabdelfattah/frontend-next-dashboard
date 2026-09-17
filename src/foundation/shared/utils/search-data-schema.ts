import type { TableMetaDataColumn } from "../components/table/types";
import type {
  SearchFilterField,
  SearchFilterFieldType,
} from "../components/search-toolbar";

function toSearchFieldType(
  column: TableMetaDataColumn
): SearchFilterFieldType | null {
  if (column.enum) return "checkbox";

  switch (column.type) {
    case "DATE":
      return "date";
    case "NUMBER":
    case "RATING":
      return "number";
    case "STRING":
      return "text";
    default:
      // IMAGE, IMAGE_GROUP, icon, etc. — nothing in SearchFilterFieldType represents them.
      return null;
  }
}

/**
 * Derives a `SearchToolbar` `dataSchema` from a table's `metaData`, so a
 * page doesn't have to hand-write one that duplicates the column config
 * already driving the `Table` itself.
 *
 * One field per public column (`isPublic !== -1`, same rule `Table` uses for
 * its own columns and the hidden id column): `secondaryCode` becomes `key`,
 * `name` becomes `label`, and `type` is derived from the column's own
 * `type` — except a column with an `enum` always becomes `"checkbox"`,
 * regardless of its `type`, with `enum` carried over as the selectable
 * values. Fields are ordered by the column's `order`. Columns with no
 * representable search type (`IMAGE`, `IMAGE_GROUP`, ...) are omitted.
 *
 * @param metaData - The same `metaData` array passed to `Table`'s `tableData`.
 *
 * @example
 * <SearchToolbar
 *   route="/api/trips.json"
 *   dataSchema={buildSearchDataSchema(tableData.metaData)}
 *   onResults={(data) => setTableData(data.result)}
 * />
 */
export function buildSearchDataSchema(
  metaData: TableMetaDataColumn[]
): SearchFilterField[] {
  return [...metaData]
    .filter((column) => column.isPublic !== -1)
    .sort((a, b) => a.order - b.order)
    .flatMap((column): SearchFilterField[] => {
      const type = toSearchFieldType(column);
      if (!type) return [];

      const field: SearchFilterField = {
        key: column.secondaryCode,
        label: column.name || column.secondaryCode,
        type,
      };

      if (column.enum) {
        field.enum = column.enum.map((option) => option.value);
      }

      return [field];
    });
}

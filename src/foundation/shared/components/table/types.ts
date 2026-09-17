import { ReactNode } from "react";
import { ActionButtonItem } from "../../types/props";
import { PageSize } from "./page-size-select";

export interface TableProps {
  tableData: TableData;
  actions?: ActionButtonItem[];
  /** Called with the requested page number when the user clicks a page — plain pagination, never resets to page 1 and never touches sort/filters. */
  onPageChange?: (page: number) => void;
  /**
   * Called with the selected rows' ids once the bulk-delete confirm dialog is
   * accepted. The table then clears the selection — actual deletion/refetch
   * is the caller's job.
   *
   * Passing this prop is also what turns on row selection: the checkbox
   * column and the floating bulk-action bar only render when `onBulkDelete`
   * is provided. There's no separate `selectable` flag — selection without
   * something to do with it isn't useful.
   */
  onBulkDelete?: (ids: string[]) => void;
  /** Called with the new sort state (or `null` when cleared) whenever the user sorts a column. */
  onSortChange?: (sort: TableSortState | null) => void;
  /** Called with one column's `secondaryCode` and its new filter value whenever a column filter is applied or cleared. Empty string means cleared — mirrors `SearchToolbar`'s `onFilterFieldChange` so a parent can merge both into one `filters` object by field. */
  onFilterChange?: (field: string, value: string) => void;
  /**
   * The authoritative filter values, if this table's column filters are
   * shared with something else (e.g. `SearchToolbar`) via a parent page. When
   * a value here differs from what a column's filter menu last showed for
   * that field — meaning something else changed it — that column's trigger
   * and, the next time its menu is opened, its filter widget resync to
   * match. Omit this prop to use `Table` standalone; its filters then only
   * ever reflect its own edits.
   */
  filters?: Record<string, string>;
  /** Called with the newly selected rows-per-page value. */
  onPageSizeChange?: (size: PageSize) => void;
}

export interface TableMetaDataEnumOption {
  value: string;
  label: string;
  color?: string;
}

export interface TableMetaDataColumn {
  secondaryCode: string;
  name: string;
  icon: string | null;
  order: number;
  type:
    | "NUMBER"
    | "IMAGE"
    | "STRING"
    | "DATE"
    | "RATING"
    | "IMAGE_GROUP"
    | string;
  isPublic: number;
  enum: TableMetaDataEnumOption[] | null;
  lookup: string | null;
}

export interface TablePaging {
  pageTitle: string;
  pageSubtitle: string | null;
  totalItems: number;
  startItem: number;
  endItem: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export type TableItem = Record<string, unknown>;

export interface TableData {
  paging: TablePaging;
  metaData: TableMetaDataColumn[];
  items: TableItem[];
}

export interface ImageGroup {
  id: string;
  name: string;
  image?: string | null;
}

/** Local (not-yet-emitted) sort state: which column, and in which direction. */
export interface TableSortState {
  field: string;
  order: "asc" | "desc";
}

// --- Server-driven sort/filter query contract. Not wired up yet. ---

export interface TableQuery {
  page: number;
  limit: number;
  search: string;
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  filters: Record<string, string>;
}




import { ReactNode } from "react";
import { ActionButtonItem } from "../../types/props";

export interface TableProps {
  tableData: TableData;
  actions?: ActionButtonItem[];
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




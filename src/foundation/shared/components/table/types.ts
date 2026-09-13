import { ReactNode } from "react";
import { ActionButtonItem } from "../../types/props";

export interface TableProps {
  tableData: TableData;
  actions?: ActionButtonItem[];
  onPageChange?: (page: number) => void;
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

// --- Server-driven sort/filter query contract. Not wired up yet. ---

export interface TableQuery {
  page: number;
  limit: number;
  search: string;
  sortBy: string | null;
  sortOrder: "asc" | "desc" | null;
  filters: Record<string, string>;
}




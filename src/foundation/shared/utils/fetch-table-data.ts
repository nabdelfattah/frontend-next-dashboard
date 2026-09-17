import { TableData } from "../components/table/table";
import { TableSortState } from "../components/table/types";

export interface TableQueryState {
  search: string;
  filters: Record<string, string>;
  sort: TableSortState | null;
  page: number;
  limit: number;
}

/**
 * Builds the query string for a combined search/filter/sort/page/limit
 * request and fetches it, returning the `result` field of the response.
 *
 * Meant to be called from a page's own `useEffect` alongside `SearchToolbar`
 * and `Table` — see [SearchToolbar → Combining with Table](../../../../docs/shared-components/search-toolbar.md#combining-with-table).
 *
 * @param query - The combined query state (`search`, `filters`, `sort`, `page`, `limit`).
 * @param url - The endpoint to fetch, e.g. `"/api/users"`.
 *
 * @example
 * useEffect(() => {
 *   fetchTableData({ search, filters, sort, page, limit }, "/api/users").then(setTableData);
 * }, [search, filters, sort, page, limit]);
 */
export async function fetchTableData(
  query: TableQueryState,
  url: string
): Promise<TableData> {
  const params = new URLSearchParams();
  if (query.search) params.set("search", query.search);
  Object.entries(query.filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (query.sort) {
    params.set("sortBy", query.sort.field);
    params.set("sortOrder", query.sort.order);
  }
  params.set("page", String(query.page));
  params.set("limit", String(query.limit));

  const response = await fetch(`${url}?${params.toString()}`);
  const json = await response.json();
  return json.result as TableData;
}

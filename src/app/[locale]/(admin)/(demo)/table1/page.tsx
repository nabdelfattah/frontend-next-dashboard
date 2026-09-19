"use client";

import {
  PageHeading,
  SearchToolbar,
  RecordDetails,
} from "@/foundation/shared/components";
import { buildSearchDataSchema } from "@/foundation/shared/utils/search-data-schema";
import { fetchTableData } from "@/foundation/shared/utils/fetch-table-data";
import { useModal } from "@/foundation/shared/hooks/use-modal";
import Table, { TableData } from "@/foundation/shared/components/table/table";
import { TableSortState } from "@/foundation/shared/components/table/types";
import { PageSize } from "@/foundation/shared/components/table/page-size-select";
import { getApiUrl } from "@/lib/app-config";
import { useEffect, useState } from "react";

const URL = getApiUrl("trips");

export default function Page() {
  const [tableData, setTableData] = useState<TableData | null>(null);

  const {
    isOpen: isDetailsOpen,
    openModal: openDetails,
    closeModal: closeDetails,
  } = useModal();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────
  // COMBINED QUERY — merged between SearchToolbar and Table, one fetch
  // ─────────────────────────────────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<TableSortState | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState<PageSize>(6);

  useEffect(() => {
    console.log(URL)
    fetchTableData({ search, filters, sort, page, limit }, URL).then(setTableData);
  }, [search, filters, sort, page, limit]);

  if (!tableData) return null;

  // generates the SearchToolbar dataSchema from the Table's metaData, mapping valid public columns to filters and skipping unsupported types.
  const searchDataSchema = buildSearchDataSchema(tableData.metaData);

  const headerActions = [
    {label: 'Add new', action: addNew}
  ]

  const tableActions = [
    { label: "View Details", action: viewDetails },
    {
      label: "Delete",
      variant: "danger" as const,
      action: (id: string) => console.log("delete", id),
    },
  ];

  function viewDetails(id: string) {
    setSelectedId(id);
    openDetails();
  }

  function addNew(){
    console.log('add new record')
  }

  function bulkDelete(ids: string[]){
    ids.forEach(element => {
        console.log("deleting element: ", element)
    });
  }

  return (
    <div>
      <PageHeading actions={headerActions}>Table 1</PageHeading>
      <div className="overflow-hidden rounded-xl border border-border bg-card p-6">
      <SearchToolbar
        dataSchema={searchDataSchema}
        filters={filters}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onFilterFieldChange={(field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
          setPage(1);
        }}
      />

      <Table
        tableData={tableData}
        actions={tableActions}
        filters={filters}
        onBulkDelete={(ids) => {
          bulkDelete(ids);
        }}
        onSortChange={(value) => {
          setSort(value);
          setPage(1);
        }}
        onFilterChange={(field, value) => {
          setFilters((prev) => ({ ...prev, [field]: value }));
          setPage(1);
        }}
        onPageSizeChange={(size) => {
          setLimit(size);
          setPage(1);
        }}
        onPageChange={(value) => setPage(value)}
      />
      </div>

      <RecordDetails
        isOpen={isDetailsOpen}
        onClose={closeDetails}
        route={URL}
        recordId={selectedId}
      />
    </div>
  );
}

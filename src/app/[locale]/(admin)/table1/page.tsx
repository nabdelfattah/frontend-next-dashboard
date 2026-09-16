"use client";

import { PageHeading, H2, Text, SearchToolbar } from "@/foundation/shared/components";
import type { SearchFilterField } from "@/foundation/shared/components/search-toolbar";
import Table, { TableData } from "@/foundation/shared/components/table/table";
import React, { useEffect, useState } from "react";

const searchDataSchema: SearchFilterField[] = [
  { key: "employee_name", label: "Name", type: "text" },
  {
    key: "employee_role",
    label: "Job",
    type: "select",
    enum: ["supervisor", "accountant", "manager"],
  },
  { key: "employee_join_date", label: "Join date", type: "date" },
];

export default function Page() {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    fetch("/api/trips.json")
      .then((res) => res.json())
      .then((json) => setTableData(json.result));
  }, []);

  if (!tableData) return null;

  const headerActions = [
    {label: 'Add new', action: addNew}
  ]

  const sampleActions = [
    { label: "View Details", path: "/table" },
    {
      label: "Delete",
      variant: "danger" as const,
      action: (id?: string) => console.log("delete", id),
    },
  ];

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
        route="/api/trips.json"
        dataSchema={searchDataSchema}
        onResults={(data) => setTableData((data as { result: TableData }).result)}
      />


      <Table
        tableData={tableData}
        actions={sampleActions}
        onBulkDelete={(ids) => {
          bulkDelete(ids);
        }}
        onPageChange={(page) =>
          setTableData((prev) =>
            prev ? { ...prev, paging: { ...prev.paging, currentPage: page } } : prev
          )
        }
      />
      </div>
    </div>
  );
}

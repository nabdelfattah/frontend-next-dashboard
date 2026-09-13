"use client";

import Table, { TableData } from "@/foundation/shared/components/table/table";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [tableData, setTableData] = useState<TableData | null>(null);

  useEffect(() => {
    fetch("/api/trips.json")
      .then((res) => res.json())
      .then((json) => setTableData(json.result));
  }, []);

  if (!tableData) return null;

  const sampleActions = [
  { label: "View Details", path: "/table" },
  {
    label: "Delete",
    variant: "danger" as const,
    action: (id?: string) => console.log("delete", id),
  },
];


  return (
    <div>
      <Table
        tableData={tableData}
        actions={sampleActions}
        onPageChange={(page) =>
          setTableData((prev) =>
            prev ? { ...prev, paging: { ...prev.paging, currentPage: page } } : prev
          )
        }
      />
    </div>
  );
}

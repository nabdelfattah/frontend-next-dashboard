"use client";

import { H2, PageHeading, Text } from "@/foundation/shared/components";
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

const items = [{label: 'home', path: "/",}, {label: 'users', path: '/users'}, {label: 'users'}]

  function bulkDelete(ids: string[]){
    ids.forEach(element => {
        console.log(element)
    });
  }


  return (
    <div>
      <PageHeading breadCrumbItems={items} >Table 2</PageHeading>
      <div className="overflow-hidden rounded-xl border border-border bg-card p-6">
        <H2 className="mb-1">secondary header</H2>
        <Text className="mb-6">some description goes here ...</Text>


      <Table
        tableData={tableData}
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

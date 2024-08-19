"use client"
"use memo"

import * as React from "react"
import { type Fund } from "@/db/schema"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getFunds } from "@/app/_lib/queries/funds"

import { getColumns } from "./fund-table-columns"
import { FundsTableToolbarActions } from "./funds-table-toolbar-actions"

interface FundTableProps {
  promise: ReturnType<typeof getFunds>
}

export function FundsTable({ promise }: FundTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Fund>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "بحث عن عنوان",
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    state: {
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <FundsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

"use client"

import * as React from "react"
import { type ProjectTransaction } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getProjectIncome } from "@/app/_lib/queries/project-transactions"

import { getColumns } from "./income-table-columns"
import { IncomeTableToolbarActions } from "./income-table-toolbar-actions"

interface IncomeTableProps {
  promise: ReturnType<typeof getProjectIncome>
}

export function IncomeTable({ promise }: IncomeTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ProjectTransaction>[] = [
    {
      label: "Amount",
      value: "amount",
      placeholder: "بحث عن مبلغ",
    },
  ]

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    filterFields,
    state: {
      sorting: [{ id: "date", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <IncomeTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

"use client"

import * as React from "react"
import { type LoanWithRelations } from "@/db/schemas/loan"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getLoans } from "@/app/_lib/queries/loans"

import { getColumns } from "./loan-table-columns"
import { LoanTableToolbarActions } from "./loan-table-toolbar-actions"

interface LoansTableProps {
  promise: ReturnType<typeof getLoans>
}

export function LoanTable({ promise }: LoansTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<LoanWithRelations>[] = [
    {
      label: "Name",
      value: "employeeId",
      placeholder: "بحث عن ",
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
        <LoanTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

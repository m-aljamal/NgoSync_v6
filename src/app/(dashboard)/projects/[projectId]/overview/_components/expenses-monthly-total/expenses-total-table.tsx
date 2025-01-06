"use client"

import React from "react"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"

import {
  getColumns,
  type StatisticsColumn,
} from "./expenses-monthly-total-overview-table-columns"
import { ExpensesOverviewTableToolbarActions } from "./expenses-table-toolbar-actions"

const ExpensesMonthlyTotelTable = ({
  data,
}: {
  data: {
    month: number
    amount: number
    amountInUSD: number
    currency: string
  }[]
}) => {
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<StatisticsColumn>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    filterFields,
    state: {
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })
  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ExpensesOverviewTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

export default ExpensesMonthlyTotelTable

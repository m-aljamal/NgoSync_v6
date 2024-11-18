"use client"

import * as React from "react"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getFundAccountSummary } from "@/app/_lib/queries/funds"

import {
  getColumns,
  type FundSummaryColumns,
} from "./fund-overview-table-columns"
import { FundOverviewTableToolbarActions } from "./fund-table-toolbar-actions"

interface FundOverviewTableProps {
  promise: ReturnType<typeof getFundAccountSummary>
}

export function FundOverviewTable({ promise }: FundOverviewTableProps) {
  const data = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<FundSummaryColumns>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    filterFields,
    state: {
      sorting: [{ id: "currencyName", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <FundOverviewTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

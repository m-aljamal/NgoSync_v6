"use client"

import * as React from "react"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getProposalStatistics } from "@/app/_lib/queries/proposals"

import {
  getColumns,
  type StatisticsColumn,
} from "./proposal-overview-table-columns"
import { ProposalOverviewTableToolbarActions } from "./proposal-table-toolbar-actions"

interface ProposalOverviewTableProps {
  promise: ReturnType<typeof getProposalStatistics>
}

export function ProposalOverviewTable({ promise }: ProposalOverviewTableProps) {
  const data = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<StatisticsColumn>[] = []

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    filterFields,
    state: {
      sorting: [{ id: "expensesCategory", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <ProposalOverviewTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

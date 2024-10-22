"use client"
"use memo"

import * as React from "react"
import { type TransferBetweenFundsWithRelations } from "@/db/schemas/transfer"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getTransferBetweenFunds } from "@/app/_lib/queries/transfers"

import { getColumns } from "./transfer-between-funds-table-columns"
import { TransferBetweenFundsTableToolbarActions } from "./transfer-between-funds-table-toolbar-actions"

interface TransferBetweenFundsTableProps {
  promise: ReturnType<typeof getTransferBetweenFunds>
}

export function TransferBetweenFundsTable({ promise }: TransferBetweenFundsTableProps) {
  const { data, pageCount } = React.use(promise)
 
  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<TransferBetweenFundsWithRelations>[] =
    [
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
      sorting: [{ id: "createdAt", desc: true }],
      pagination: { pageIndex: 0, pageSize: 10 },
      columnPinning: { right: ["actions"] },
    },
  })

  return (
    <DataTable table={table}>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <TransferBetweenFundsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

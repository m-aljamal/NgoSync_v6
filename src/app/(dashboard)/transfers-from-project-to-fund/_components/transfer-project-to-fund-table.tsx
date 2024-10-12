"use client"
"use memo"

import * as React from "react"
import { type TransferProjectToFundWithRelations } from "@/db/schemas/transfer"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getTransferProjectToFund } from "@/app/_lib/queries/transfers"

import { getColumns } from "./transfer-project-to-fund-table-columns"
import { TransferProjectToFundTableToolbarActions } from "./transfer-project-to-fund-table-toolbar-actions"

interface TransferProjectToFundTableProps {
  promise: ReturnType<typeof getTransferProjectToFund>
}

export function TransferProjectToFundTable({
  promise,
}: TransferProjectToFundTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<TransferProjectToFundWithRelations>[] =
    [
      {
        label: "المبلغ",
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
        <TransferProjectToFundTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

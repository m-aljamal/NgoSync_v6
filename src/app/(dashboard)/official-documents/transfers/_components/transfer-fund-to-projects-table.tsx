"use client"

import * as React from "react"
import type { TransferFundToProjectWithRelations } from "@/db/schemas/transfer"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getTransferFundToProject } from "@/app/_lib/queries/transfers"

import { getColumns } from "./transfer-fund-to-projects-table-columns"
import { TransferFundToProjectTableToolbarActions } from "@/app/(dashboard)/_components/transfer-fund-to-project/transfer-fund-to-projects-table-toolbar-actions"
 

interface TransferFundToProjectTableProps {
  promise: ReturnType<typeof getTransferFundToProject>
}

export function TransferFundToProjectTable({
  promise,
}: TransferFundToProjectTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<TransferFundToProjectWithRelations>[] =
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
        <TransferFundToProjectTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

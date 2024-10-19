"use client"

import * as React from "react"
import { type TransferBetweenProjectsWithRelations } from "@/db/schemas/transfer"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getTransferBetweenProjects } from "@/app/_lib/queries/transfers"

import { getColumns } from "./transfer-between-projects-table-columns"
import { TransferBetweenProjectsTableToolbarActions } from "./transfer-between-projects-table-toolbar-actions"

interface TransferBetweenProjectsTableProps {
  promise: ReturnType<typeof getTransferBetweenProjects>
}

export function TransferBetweenProjectsTable({
  promise,
}: TransferBetweenProjectsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<TransferBetweenProjectsWithRelations>[] =
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
        <TransferBetweenProjectsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

"use client"
"use memo"

import * as React from "react"
import { type ExchangeBetweenProjectsWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getExchangeBetweenProjects } from "@/app/_lib/queries/currency"

import { getColumns } from "./exchange-between-projects-table-columns"
import { ExchangeBetweenProjectsTableToolbarActions } from "./exchange-between-projects-table-toolbar-actions"

interface ExchangeBetweenProjectsTableProps {
  promise: ReturnType<typeof getExchangeBetweenProjects>
}

export function ExchangeBetweenProjectsTable({
  promise,
}: ExchangeBetweenProjectsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ExchangeBetweenProjectsWithRelations>[] =
    [
      // {
      //   label: "Amount",
      //   value: "toAmount",
      //   placeholder: "بحث عن مبلغ",
      // },
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
        <ExchangeBetweenProjectsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

"use client"
"use memo"

import * as React from "react"
import { type ExchangeBetweenFundsWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getExchangeBetweenFunds } from "@/app/_lib/queries/currency"

import { getColumns } from "./exchange-between-funds-table-columns"
import { ExchangeBetweenFundsTableToolbarActions } from "./exchange-between-funds-table-toolbar-actions"

interface ExchangeBetweenFundsTableProps {
  promise: ReturnType<typeof getExchangeBetweenFunds>
}

export function ExchangeBetweenFundsTable({
  promise,
}: ExchangeBetweenFundsTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ExchangeBetweenFundsWithRelations>[] =
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
        <ExchangeBetweenFundsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

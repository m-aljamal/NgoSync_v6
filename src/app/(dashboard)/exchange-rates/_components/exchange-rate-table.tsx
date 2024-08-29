"use client"
"use memo"

import * as React from "react"
import { type ExchangeRate } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getExchangeRates } from "@/app/_lib/queries/currency"

import { getColumns } from "./exchange-rate-columns"
import { ExchangeRateTableToolbarActions } from "./exchange-rate-table-toolbar-actions"

interface ExchangeRateTableProps {
  promise: ReturnType<typeof getExchangeRates>
}

export function ExchangeRateTable({ promise }: ExchangeRateTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<ExchangeRate>[] = [
    {
      label: "Amount",
      value: "rate",
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
        <ExchangeRateTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

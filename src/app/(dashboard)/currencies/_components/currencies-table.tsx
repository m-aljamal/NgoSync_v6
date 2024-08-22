"use client"
"use memo"

import * as React from "react"
import { type Currency } from "@/db/schemas/currency"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getCurrencies } from "@/app/_lib/queries/currency"

import { getColumns } from "./currency-table-columns"
import { CurrencyTableToolbarActions } from "./currency-table-toolbar-actions"

interface CurrencyTableProps {
  promise: ReturnType<typeof getCurrencies>
}

export function CurrenciesTable({ promise }: CurrencyTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Currency>[] = [
    {
      label: "Name",
      value: "name",
      placeholder: "بحث عن عنوان",
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
        <CurrencyTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}

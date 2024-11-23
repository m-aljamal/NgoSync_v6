"use client"
"use memo"

import * as React from "react"
import { type ProjectTransactionWithRelations } from "@/db/schemas"
import { type DataTableFilterField } from "@/types"

import { useDataTable } from "@/hooks/use-data-table"
import { useGetCurrencies } from "@/hooks/use-get-form-data"
import { DataTable } from "@/components/data-table/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { type getExpenses } from "@/app/_lib/queries/expenses"

import { getColumns } from "./expense-table-columns"
import { ExpensesTableToolbarActions } from "./expenses-table-toolbar-actions"

interface ExpenseTableProps {
  promise: ReturnType<typeof getExpenses>
  isOfficial?: boolean
}

export function ExpenseTable({ promise, isOfficial }: ExpenseTableProps) {
  const { data, pageCount } = React.use(promise)

  const columns = React.useMemo(() => getColumns(isOfficial), [isOfficial])
  const { data: currencies, isLoading: loadingCurrencies } = useGetCurrencies()
  const filterFields: DataTableFilterField<ProjectTransactionWithRelations>[] =
    [
      {
        label: "المبلغ",
        value: "amount",
        placeholder: "بحث عن مبلغ",
      },

      {
        label: "العملة",
        value: "currencyCode",
        options: loadingCurrencies
          ? [
              {
                label: "جاري التحميل...",
                value: "loading",
              },
            ]
          : currencies?.map((currency) => ({
              label: currency.name,
              value: currency.code,
              withCount: true,
            })),
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
        <ExpensesTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
